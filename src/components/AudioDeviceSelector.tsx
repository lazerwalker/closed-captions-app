import * as React from "react";
import { useContext } from "react";
import { switchAudioDeviceAction } from "../actions";
import { DispatchContext } from "./App";

interface Props {
  devices: MediaDeviceInfo[];
}

export default function (props: Props) {
  const dispatch = useContext(DispatchContext);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(switchAudioDeviceAction(e.target.value));
  };

  return (
    <select name="devices" onChange={onChange}>
      {props.devices.map((deviceOption) => {
        return (
          <option value={deviceOption.deviceId} key={deviceOption.deviceId}>
            {deviceOption.label}
          </option>
        );
      })}
    </select>
  );
}
