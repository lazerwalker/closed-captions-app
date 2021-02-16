/* eslint-disable @typescript-eslint/no-var-requires */
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
require("dotenv").config();

import {
  ResultReason,
  CancellationReason,
} from "microsoft-cognitiveservices-speech-sdk";
import { Dispatch } from "react";
import { Action, addCaptionAction } from "./actions";

// set up the Azure Cognitive Services Speech SDK to use subscription
// data from environment variables (via .env or otherwise)
const speechConfig = sdk.SpeechConfig.fromSubscription(
  process.env.COGNITIVE_SERVICES_KEY,
  process.env.COGNITIVE_SERVICES_REGION
);

let recognizer: sdk.SpeechRecognizer | undefined;

export async function setUpSpeechRecognizer(
  deviceId: string,
  dispatch: Dispatch<Action>
): Promise<void> {
  // if (recognizer) {
  //   await recognizer.stopContinuousRecognitionAsync();
  // }

  const audioConfig = sdk.AudioConfig.fromMicrophoneInput(deviceId);
  recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  recognizer.recognizing = (s, e) => {
    console.log(`RECOGNIZING: Text=${e.result.text}`);
    dispatch(addCaptionAction(e.result.text));
  };

  recognizer.recognized = (s, e) => {
    if (e.result.reason == ResultReason.RecognizedSpeech) {
      console.log(`RECOGNIZED: Text=${e.result.text}`);
      dispatch(addCaptionAction(e.result.text));
    } else if (e.result.reason == ResultReason.NoMatch) {
      console.log("NOMATCH: Speech could not be recognized.");
    }
  };

  recognizer.canceled = (s, e) => {
    console.log(`CANCELED: Reason=${e.reason}`);

    if (e.reason == CancellationReason.Error) {
      console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
      console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
      console.log("CANCELED: Did you update the subscription info?");
    }

    recognizer.stopContinuousRecognitionAsync();
  };

  recognizer.sessionStopped = (s, e) => {
    console.log("\n    Session stopped event.");
    recognizer.stopContinuousRecognitionAsync();
  };

  recognizer.startContinuousRecognitionAsync();
}
