import * as React from "react";

interface Props {
  caption: string;
  speaker: string;
}

export default function (props: Props) {
  return (
    <p id="captions">
      <strong>{props.speaker}:&nbsp;</strong>
      {props.caption}
    </p>
  );
}
