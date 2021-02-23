import * as React from "react";
import { useState, useContext } from "react";
import { DispatchContext } from "./App";
import { changeNameAction } from "../actions";
import { changedUserId } from "../signalR";

export default function (props: {}) {
  const dispatch = useContext(DispatchContext);

  const [userId, setUserId] = useState("name here");

  const userIdChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(event.target.value);
    dispatch(changeNameAction(event.target.value));
    changedUserId(event.target.value);
  };

  return (
    <div className="self">
      <label htmlFor="userId">Your Name:</label>
      <input type="text" id="userId" value={userId} onChange={userIdChanged} />
    </div>
  );
}
