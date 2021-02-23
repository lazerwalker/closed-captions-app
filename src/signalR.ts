import * as signalR from "@microsoft/signalr";

let userId: string;

export function changedUserId(newUserId: string) {
  userId = newUserId;
}

export async function setUpSignalR() {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://live-captions.azurewebsites.net/api")
    .build();

  connection.on("text", (text, id) => {
    if (userId === id) return;
    console.log(`${id}: ${text}`);
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
