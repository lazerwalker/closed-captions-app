import * as signalR from "@microsoft/signalr";
import { Dispatch } from "react";
import { Action, receivedRemoteCaptionAction } from "./actions";
import { Caption } from "./reducer";

export async function setUpSignalR(
  dispatch: Dispatch<Action>,
  userId: string
): Promise<void> {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://live-captions.azurewebsites.net/api")
    .build();

  connection.on("text", (caption: Caption) => {
    dispatch(receivedRemoteCaptionAction(caption));
  });

  await connection.start();
}

export async function sendSignalRMessage(caption: Caption): Promise<Response> {
  return fetch("https://live-captions.azurewebsites.net/api/sendMessage", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ caption }),
  });
}
