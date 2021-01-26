import * as React from "react";

interface Props {
  caption: string;
}

export default function (props: Props) {
  return <p id="captions">{props.caption}</p>;
}
