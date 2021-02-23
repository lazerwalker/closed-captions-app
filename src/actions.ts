export type Action =
  | AddCaptionAction
  | ListAudioDevicesAction
  | SwitchAudioDeviceAction
  | ChangeNameAction;

export enum ActionType {
  AddCaption = "addCaption",
  ListAudioDevices = "listAudioDevices",
  SwitchAudioDevice = "switchAudioDevice",
  ChangeName = "changeName",
}

type AddCaptionAction = {
  type: ActionType.AddCaption;
  value: string;
};

export function addCaptionAction(caption: string): AddCaptionAction {
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

type ChangeNameAction = {
  type: ActionType.ChangeName;
  value: string;
};

export function changeNameAction(name: string): ChangeNameAction {
  return { type: ActionType.ChangeName, value: name };
}
