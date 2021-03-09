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

export function sendWebSocketMessage(message: Caption): void {
  // WebSocket.readyState 1 is "OPEN"
  if (!ws || ws.readyState !== 1) return;
  ws.send(`${message.userId}: ${message.text}`);
}
