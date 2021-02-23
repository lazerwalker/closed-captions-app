import * as signalR from "@microsoft/signalr";
import { Dispatch } from "react";
import { Action, receivedRemoteCaptionAction } from "./actions";
import { State } from "./reducer";

let userId: string;

export function changedUserId(newUserId: string): void {
  userId = newUserId;
}

export async function setUpSignalR(dispatch: Dispatch<Action>): Promise<void> {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://live-captions.azurewebsites.net/api")
    .build();

  connection.on("text", (text, id) => {
    if (userId === id) return;
    dispatch(receivedRemoteCaptionAction(id, text));
  });

  await connection.start();
}

export async function sendSignalRMessage(caption: string): Promise<Response> {
  return fetch("https://live-captions.azurewebsites.net/api/sendMessage", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: caption, userId }),
  });
}
