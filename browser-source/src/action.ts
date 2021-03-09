export type Action = CaptionAction

export enum ActionType {
  Caption = "CAPTION"
}

type CaptionAction = {
  type: ActionType.Caption,
  value: string
}

export const createCaptionAction = (caption: Caption): CaptionAction {
  return {
    type: ActionType.Caption,
    value: message
  }
}