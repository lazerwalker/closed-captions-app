import OBSWebSocket from "obs-websocket-js";

let obs: OBSWebSocket;

export async function startOBS() {
  obs = new OBSWebSocket();
  try {
    await obs.connect();
    console.log("Connected!");
  } catch (e) {
    console.log("OBS error", e);
  }
}

export async function sendObsCaption(text: string) {
  obs.send("SendCaptions", { text });
}
