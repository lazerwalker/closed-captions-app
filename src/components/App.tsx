// External Dependencies
import * as React from "react";
import { createContext, useEffect, useReducer } from "react";
import * as ReactDOM from "react-dom";

// import { startOBS, sendObsCaption } from "../obs";
import { Action, listAudioDevicesAction } from "../actions";
import reducer, { initialState } from "../reducer";
import { State } from "../reducer";
import { setUpSpeechRecognizer } from "../speechRecognizer";
import { startWebSocket, sendWebSocketMessage } from "../webSocket";
import { setUpSignalR, sendSignalRMessage } from "../signalR";

import AudioDeviceSelector from "./AudioDeviceSelector";
import CaptionView from "./CaptionView";
import NameInputView from "./NameInputView";

export const DispatchContext = createContext(null);

const App = () => {
  const [state, dispatch] = useReducer<(s: State, a: Action) => State>(
    reducer,
    initialState
  );

  useEffect(() => {
    async function run() {
      const devices = (await navigator.mediaDevices.enumerateDevices()).filter(
        (d) => d.kind === "audioinput"
      );
      dispatch(listAudioDevicesAction(devices));

      // startOBS();

      setUpSignalR(dispatch, state.userId);

      startWebSocket();
    }
    run();
  }, []);

  useEffect(() => {
    setUpSpeechRecognizer(state.currentDeviceId, dispatch, state.userId);
  }, [state.currentDeviceId]);

  // OBS's SendCaptions function technically works,
  // but is a bit janky and needs massaging.
  // Let's focus on baked-in open captions for now and revisit later

  // useEffect(() => {
  //   sendObsCaption(state.currentCaption);
  // }, [state.currentCaption]);

  useEffect(() => {
    sendWebSocketMessage(state.currentLocalCaption);
    sendSignalRMessage(state.currentLocalCaption);
  }, [state.currentLocalCaption]);

  const captionViews = state.renderCaptions.map((caption) => {
    return <CaptionView caption={caption} />;
  });

  return (
    <DispatchContext.Provider value={dispatch}>
      <div>
        <h1>Captions!</h1>
        <AudioDeviceSelector devices={state.audioDevices} />
        {captionViews}
        <NameInputView />
      </div>
    </DispatchContext.Provider>
  );
};

function render() {
  ReactDOM.render(<App />, document.body);
}

render();
