import { useEffect, useReducer } from "react";
import * as React from "react";
import { startWebSocket } from "../webSocket";
import { initialState, reducer, State } from "../reducer";
import {
  Action,
  createCaptionAction,
  updateDisplayNameAction,
} from "../action";

import { Caption } from "../../../src/reducer";
import CaptionView from "../../../src/components/CaptionView";

export default (): React.ReactNode => {
  const [state, dispatch] = useReducer<(s: State, a: Action) => State>(
    reducer,
    initialState
  );

  useEffect(() => {
    console.log("Trying to start websocket");
    startWebSocket((text) => {
      type WebSocketMessage = {
        caption?: Caption;
        displayNameMapping?: { displayName: string; userId: string };
      };
      const obj: WebSocketMessage = JSON.parse(text);
      console.log(obj);
      if (obj.caption) {
        dispatch(createCaptionAction(obj.caption));
      } else if (obj.displayNameMapping) {
        dispatch(updateDisplayNameAction(obj.displayNameMapping));
      }
    });
  }, []);

  return (
    <div>
      {state.renderCaptions.map((caption) => {
        return (
          <CaptionView
            caption={caption}
            displayNameMapping={state.displayNameMapping}
            key={caption.phraseId}
          />
        );
      })}
    </div>
  );
};
