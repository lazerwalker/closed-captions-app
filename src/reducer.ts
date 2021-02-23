import { Action, ActionType } from "./actions";

export type State = {
  currentCaption?: string;
  audioDevices: MediaDeviceInfo[];
  currentDeviceId?: string;
  userId: string;
};

export const initialState: State = {
  audioDevices: [],
  userId: "some name",
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

  if (action.type === ActionType.ChangeName) {
    state.userId = action.value;
  }

  return state;
};
