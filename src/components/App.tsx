import * as React from "react";
import { createContext, useEffect, useReducer } from "react";
import * as ReactDOM from "react-dom";
import { startOBS, sendObsCaption } from "../obs";
import { Action, listAudioDevicesAction } from "../actions";
import reducer, { initialState } from "../reducer";
import { State } from "../reducer";
import { setUpSpeechRecognizer } from "../speechRecognizer";
import AudioDeviceSelector from "./AudioDeviceSelector";
import CaptionView from "./CaptionView";

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

      setUpSpeechRecognizer(devices[0].deviceId, dispatch);
      startOBS();
    }
    run();
  }, []);

  useEffect(() => {
    setUpSpeechRecognizer(state.currentDeviceId, dispatch);
  }, [state.currentDeviceId]);

  useEffect(() => {
    sendObsCaption(state.currentCaption);
  }, [state.currentCaption]);

  return (
    <DispatchContext.Provider value={dispatch}>
      <div>
        <h1>Captions!</h1>
        <AudioDeviceSelector devices={state.audioDevices} />
        <CaptionView caption={state.currentCaption} />
      </div>
    </DispatchContext.Provider>
  );
};

function render() {
  ReactDOM.render(<App />, document.body);
}

render();
