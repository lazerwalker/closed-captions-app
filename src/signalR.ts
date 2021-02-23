import * as signalR from "@microsoft/signalr";
import { v4 as uuid } from "uuid";

const userId = uuid();

export async function setUpSignalR() {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://live-captions.azurewebsites.net/api")
    .build();

  connection.on("text", (text, userId) => {
    console.log(`${userId}: ${text}`);
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
