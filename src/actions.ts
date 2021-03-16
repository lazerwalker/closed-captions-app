import { Caption } from "./reducer";

export type Action =
  | AddCaptionAction
  | ListAudioDevicesAction
  | SwitchAudioDeviceAction
  | UpdateDisplayNameAction
  | ReceivedRemoteCaptionAction;

export enum ActionType {
  AddCaption = "addCaption",
  ListAudioDevices = "listAudioDevices",
  SwitchAudioDevice = "switchAudioDevice",
  UpdateDisplayName = "UpdateDisplayNameAction",
  ReceivedRemoteCaption = "receivedRemoteCaption",
}

type AddCaptionAction = {
  type: ActionType.AddCaption;
  value: Caption;
};

export function addCaptionAction(caption: Caption): AddCaptionAction {
  return {
    type: ActionType.AddCaption,
    value: caption,
  };
}

type ListAudioDevicesAction = {
  type: ActionType.ListAudioDevices;
  value: MediaDeviceInfo[];
};

export function listAudioDevicesAction(
  devices: MediaDeviceInfo[]
): ListAudioDevicesAction {
  return {
    type: ActionType.ListAudioDevices,
    value: devices,
  };
}

type SwitchAudioDeviceAction = {
  type: ActionType.SwitchAudioDevice;
  value: string;
};

export function switchAudioDeviceAction(
  devices: string
): SwitchAudioDeviceAction {
  return {
    type: ActionType.SwitchAudioDevice,
    value: devices,
  };
}

type UpdateDisplayNameAction = {
  type: ActionType.UpdateDisplayName;
  value: { displayName: string; userId: string };
};

export function updateDisplayNameAction(
  displayName: string,
  userId: string
): UpdateDisplayNameAction {
  return { type: ActionType.UpdateDisplayName, value: { displayName, userId } };
}

type ReceivedRemoteCaptionAction = {
  type: ActionType.ReceivedRemoteCaption;
  value: Caption;
};

export function receivedRemoteCaptionAction(
  caption: Caption
): ReceivedRemoteCaptionAction {
  return {
    type: ActionType.ReceivedRemoteCaption,
    value: caption,
  };
}
