import * as React from "react";
import { Caption } from "../reducer";

interface Props {
  caption: Caption;
  displayNameMapping: { [userId: string]: string };
}

export default function (props: Props) {
  return (
    <p id="captions">
      <strong>{props.displayNameMapping[props.caption.userId]}:&nbsp;</strong>
      {props.caption.text}
    </p>
  );
}
