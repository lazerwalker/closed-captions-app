import { v4 as uuid } from "uuid";

import { Action, ActionType } from "./actions";
export type Caption = {
  userId: string;
  text: string;
  phraseId: string;
  isCompleted: boolean;
};

const MAX_CAPTIONS_ON_SCREEN = 3;

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
  const state: State = JSON.parse(JSON.stringify(oldState));

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
    const matchingCaptionIndex = state.renderCaptions.findIndex((caption) => {
      return caption.phraseId === action.value.phraseId;
    });

    if (matchingCaptionIndex !== -1) {
      state.renderCaptions[matchingCaptionIndex] = action.value;
    } else {
      state.renderCaptions.unshift(action.value);

      if (state.renderCaptions.length > MAX_CAPTIONS_ON_SCREEN) {
        state.renderCaptions = state.renderCaptions.slice(
          0,
          MAX_CAPTIONS_ON_SCREEN
        );
      }
    }
  }

  return state;
};
