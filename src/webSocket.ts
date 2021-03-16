import { Caption } from "./reducer";

require("dotenv").config();

const port = process.env.TWITCH_LIVE_SERVER_PORT;
let ws: WebSocket;

export function startWebSocket(): void {
  ws = new WebSocket(`ws://localhost:${port}`);
  ws.onmessage = (message) => {
    console.log(`Message: ${message.data}`);
  };
}

export function sendWebSocketCaption(caption: Caption): void {
  // WebSocket.readyState 1 is "OPEN"
  if (!ws || ws.readyState !== 1) return;
  ws.send(JSON.stringify({ caption }));
}

export function sendWebSocketDisplayName(
  displayName: string,
  userId: string
): void {
  // WebSocket.readyState 1 is "OPEN"
  if (!ws || ws.readyState !== 1) return;
  ws.send(JSON.stringify({ displayNameMapping: { displayName, userId } }));
}
