// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
import handler from "serve-handler";
import http from "http";
import WebSocket from "ws";

const port = parseInt(process.env.TWITCH_LIVE_SERVER_PORT, 10);

export const startHttpAndWsServer = (): [http.Server, WebSocket.Server] => {
  const server = http.createServer((request, response) => {
    // You pass two more arguments for config and middleware
    // More details here: https://github.com/vercel/serve-handler#options
    return handler(request, response, {
      public: "./browser-source/dist",
      cleanUrls: true,
    });
  });

  server.listen(port, () => {
    console.log(`Running at http://localhost:${port}`);
  });

  const wss = new WebSocket.Server({
    server,
  });

  let clients: WebSocket[] = []; // array of all clients, which are added as they join
  wss.on("connection", (ws) => {
    clients.push(ws);

    ws.on("message", (message) => {
      clients
        .filter((client) => client !== ws) // filter through every client, excluding the one that sent the message
        .forEach((client) => client.send(message)); // send the message to every client except for the one that sent it
    });

    ws.on("close", () => {
      clients = clients.filter((client) => client !== ws);
    });
  });
  return [server, wss];
};
