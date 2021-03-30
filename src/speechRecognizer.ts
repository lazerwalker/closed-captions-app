require("dotenv").config();

/* eslint-disable @typescript-eslint/no-var-requires */
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import {
  ResultReason,
  CancellationReason,
} from "microsoft-cognitiveservices-speech-sdk";
import { Dispatch } from "react";
import { v4 as uuid } from "uuid";

import { Action, addCaptionAction } from "./actions";
import { Caption } from "./reducer";

const enableLogging = false;

// set up the Azure Cognitive Services Speech SDK to use subscription
// data from environment variables (via .env or otherwise)
const speechConfig = sdk.SpeechConfig.fromSubscription(
  process.env.COGNITIVE_SERVICES_KEY,
  process.env.COGNITIVE_SERVICES_REGION
);

let recognizer: sdk.SpeechRecognizer | undefined;

let currentPhraseId: string = uuid();

function recognizerResultToCaption(
  result: sdk.SpeechRecognitionResult,
  userId: string
): Caption {
  if (enableLogging) console.log(result);
  return {
    userId,
    text: result.text,
    // 3 = recognized (instead of recognizing)
    isCompleted: result.reason === 3,
    phraseId: currentPhraseId,
  };
}

type SpeechRecognizerListener = (caption: Caption) => void;
const listeners: SpeechRecognizerListener[] = [];

export function addSpeechRecognizerListener(
  fn: SpeechRecognizerListener
): void {
  listeners.push(fn);
}

export async function setUpSpeechRecognizer(
  deviceId: string,
  dispatch: Dispatch<Action>,
  userId: string
): Promise<void> {
  if (recognizer) {
    // This was failing when we called it immediately after starting recognition
    // There may be some status/internal state we can query for before trying to stop
    await recognizer.stopContinuousRecognitionAsync();
  }

  if (enableLogging) console.log("Set up speech recognizer");
  const audioConfig = sdk.AudioConfig.fromMicrophoneInput(deviceId);
  recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  recognizer.recognizing = (speechRecognizerObject, speechRecognizerEvent) => {
    if (enableLogging)
      console.log(
        `RECOGNIZING ${speechRecognizerEvent.result.resultId}: Text=${speechRecognizerEvent.result.text}`
      );
    const message = recognizerResultToCaption(
      speechRecognizerEvent.result,
      userId
    );
    dispatch(addCaptionAction(message));
    listeners.forEach((fn) => fn(message));
  };

  recognizer.recognized = (speechRecognizerObject, speechRecognizerEvent) => {
    if (speechRecognizerEvent.result.reason == ResultReason.RecognizedSpeech) {
      if (enableLogging)
        console.log(`RECOGNIZED: Text=${speechRecognizerEvent.result.text}`);
      const message = recognizerResultToCaption(
        speechRecognizerEvent.result,
        userId
      );
      dispatch(addCaptionAction(message));
      listeners.forEach((fn) => fn(message));
    } else if (speechRecognizerEvent.result.reason == ResultReason.NoMatch) {
      if (enableLogging)
        console.log("NOMATCH: Speech could not be recognized.");
    }
    currentPhraseId = uuid();
  };

  recognizer.canceled = (speechRecognizerObject, speechRecognizerEvent) => {
    if (enableLogging)
      console.log(`CANCELED: Reason=${speechRecognizerEvent.reason}`);

    if (speechRecognizerEvent.reason == CancellationReason.Error) {
      if (enableLogging) {
        console.log(`"CANCELED: ErrorCode=${speechRecognizerEvent.errorCode}`);
        console.log(
          `"CANCELED: ErrorDetails=${speechRecognizerEvent.errorDetails}`
        );
        console.log("CANCELED: Did you update the subscription info?");
      }
    }

    recognizer.stopContinuousRecognitionAsync();
  };

  recognizer.sessionStopped = (
    speechRecognizerObject,
    speechRecognizerEvent
  ) => {
    if (enableLogging) console.log("\n    Session stopped event.");
    recognizer.stopContinuousRecognitionAsync();
  };

  recognizer.startContinuousRecognitionAsync();
}
