import * as signalR from "@microsoft/signalr";
import { Dispatch } from "react";
import {
  Action,
  receivedRemoteCaptionAction,
  updateDisplayNameAction,
} from "./actions";
import { Caption } from "./reducer";

export async function setUpSignalR(dispatch: Dispatch<Action>): Promise<void> {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://live-captions.azurewebsites.net/api")
    .build();

  connection.on("text", (caption: Caption) => {
    dispatch(receivedRemoteCaptionAction(caption));
  });

  connection.on("updateDisplayName", (displayName: string, userId: string) => {
    dispatch(updateDisplayNameAction(displayName, userId));
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

export async function updateDisplayName(
  displayName: string,
  userId: string
): Promise<Response> {
  return fetch(
    "https://live-captions.azurewebsites.net/api/updateDisplayName",
    {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ displayName, userId }),
    }
  );
}
