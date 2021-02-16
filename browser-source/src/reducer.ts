import { Action, ActionType } from "./action";

export type State = {
  currentCaption?: string;
};

export const initialState: State = {};

export function reducer(state: State, action: Action): State {
  const newState = JSON.parse(JSON.stringify(state));

  if (action.type === ActionType.Caption) {
    newState.currentCaption = action.value;
  }

  return newState;
}
