let ws: WebSocket;

export function startWebSocket(handler: (message: string) => void): void {
  console.log(
    "Opening websocket to ",
    `ws://${window.location.hostname}:${window.location.port}`
  );
  ws = new WebSocket(
    `ws://${window.location.hostname}:${window.location.port}`
  );

  ws.addEventListener("open", () => {
    console.log("Opened");
  });

  ws.addEventListener("error", (e) => {
    console.log("Error", e);
  });

  ws.addEventListener("message", (message) => {
    console.log(`Message: ${message.data}`);
    handler(message.data);
  });
}

export function sendWebSocketMesage(message: string): void {
  ws.send(message);
}
