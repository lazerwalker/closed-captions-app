import { v4 as uuid } from "uuid";

import { Action, ActionType } from "./actions";
export type Caption = {
  userId: string;
  text: string;
  phraseId: string;
  isCompleted: boolean;
};

export type State = {
  currentLocalCaption?: Caption;
  renderCaptions: Caption[];
  audioDevices: MediaDeviceInfo[];
  currentDeviceId?: string;
  userId: string;
  displayName?: string;
};

export const initialState: State = {
  audioDevices: [],
  userId: uuid(),
  renderCaptions: [],
};

export default (oldState: State, action: Action): State => {
  const state = JSON.parse(JSON.stringify(oldState));

  if (action.type === ActionType.AddCaption) {
    state.currentLocalCaption = action.value;
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

  if (action.type === ActionType.ReceivedRemoteCaption) {
    state.currentLocalCaption = action.value;
  }

  return state;
};
