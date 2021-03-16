import { Caption } from "../../src/reducer";

export type Action = CaptionAction | UpdateDisplayNameAction;

export enum ActionType {
  Caption = "CAPTION",
  UpdateDisplayName = "UPDATE_DISPLAY_NAME",
}

type CaptionAction = {
  type: ActionType.Caption;
  value: Caption;
};

export const createCaptionAction = (caption: Caption): CaptionAction => {
  return {
    type: ActionType.Caption,
    value: caption,
  };
};

type UpdateDisplayNameAction = {
  type: ActionType.UpdateDisplayName;
  value: {
    displayName: string;
    userId: string;
  };
};

export const updateDisplayNameAction = (update: {
  displayName: string;
  userId: string;
}): UpdateDisplayNameAction => {
  return {
    type: ActionType.UpdateDisplayName,
    value: update,
  };
};
