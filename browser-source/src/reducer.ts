import { Action, ActionType } from "./action";
import { Caption } from "../../src/reducer";

const MAX_CAPTIONS_ON_SCREEN = 3;

export type State = {
  renderCaptions: Caption[];
  displayNameMapping: { [userId: string]: string };
};

export const initialState: State = {
  renderCaptions: [],
  displayNameMapping: {},
};

export function reducer(oldState: State, action: Action): State {
  const state = JSON.parse(JSON.stringify(oldState));

  if (action.type === ActionType.Caption) {
    const matchingCaptionIndex = state.renderCaptions.findIndex((caption) => {
      return caption.phraseId === action.value.phraseId;
    });

    if (matchingCaptionIndex !== -1) {
      if (!state.renderCaptions[matchingCaptionIndex].isCompleted) {
        state.renderCaptions[matchingCaptionIndex] = action.value;
      }
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

  if (action.type === ActionType.UpdateDisplayName) {
    state.displayNameMapping[action.value.userId] = action.value.displayName;
  }

  return state;
}
