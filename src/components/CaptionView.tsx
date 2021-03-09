import * as React from "react";
import { Caption } from "../reducer";

interface Props {
  caption: Caption;
}

export default function (props: Props) {
  return (
    <p id="captions">
      <strong>{props.caption.userId}:&nbsp;</strong>
      {props.caption.text}
    </p>
  );
}
