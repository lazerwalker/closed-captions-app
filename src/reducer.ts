import { Action, ActionType } from "./actions";

export type State = {
  currentCaption?: string;
  audioDevices: MediaDeviceInfo[];
  currentDeviceId?: string;
};

export const initialState: State = {
  audioDevices: [],
};

export default (oldState: State, action: Action): State => {
  const state = JSON.parse(JSON.stringify(oldState));

  if (action.type === ActionType.AddCaption) {
    state.currentCaption = action.value;
  }

  if (action.type === ActionType.ListAudioDevices) {
    state.audioDevices = action.value;
  }

  if (action.type === ActionType.SwitchAudioDevice) {
    state.currentDeviceId = action.value;
  }

  return state;
};
