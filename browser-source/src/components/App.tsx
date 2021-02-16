import { useEffect, useReducer } from "react";
import * as React from "react";
import { startWebSocket } from "../webSocket";
import { initialState, reducer, State } from "../reducer";
import { Action, createCaptionAction } from "../action";

export default (): React.ReactNode => {
  const [state, dispatch] = useReducer<(s: State, a: Action) => State>(
    reducer,
    initialState
  );

  useEffect(() => {
    console.log("Trying to start websocket");
    startWebSocket((message) => {
      dispatch(createCaptionAction(message));
    });
  }, []);

  return (
    <div>
      <div>{state.currentCaption}</div>
    </div>
  );
};
