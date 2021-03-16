import * as React from "react";
import { updateDisplayName } from "../signalR";

export default function (props: { userId: string }) {
  const inputRef = React.createRef<HTMLInputElement>();

  const displayNameChanged = (event: React.MouseEvent) => {
    updateDisplayName(inputRef.current.value, props.userId);
  };

  return (
    <div className="self">
      <label htmlFor="userId">Your Name:</label>
      <input type="text" id="userId" ref={inputRef} />
      <button onClick={displayNameChanged}>Update</button>
    </div>
  );
}
