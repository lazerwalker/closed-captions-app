import * as signalR from "@microsoft/signalr";
import { Dispatch } from "react";
import {
  Action,
  receivedRemoteCaptionAction,
  updateDisplayNameAction,
} from "./actions";
import { Caption } from "./reducer";
import {
  handleRemoteIceCandidate,
  handleSentConnectionAnswer,
  handleSentConnectionOffer,
  initiateWebRTCConnection,
} from "./webrtc";
import { sendWebSocketCaption, sendWebSocketDisplayName } from "./webSocket";

export async function setUpSignalR(
  userId: string,
  dispatch: Dispatch<Action>
): Promise<void> {
  class CustomHttpClient extends signalR.DefaultHttpClient {
    public send(request: signalR.HttpRequest): Promise<signalR.HttpResponse> {
      request.headers = {
        ...request.headers,
        "x-ms-client-principal-id": userId,
      };
      return super.send(request);
    }
  }

  const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://live-captions.azurewebsites.net/api", {
      httpClient: new CustomHttpClient(console),
    })
    .configureLogging(signalR.LogLevel.Information)
    .build();

  connection.on("broadcast", (broadcastUserId: string) => {
    if (userId === broadcastUserId) return;
    console.log("Received broadcast from", broadcastUserId);
    initiateWebRTCConnection(userId, broadcastUserId);
  });

  connection.on("receiveOffer", (sender: string, offerJSON: string) => {
    console.log("Received offer from", sender);
    const offer = new RTCSessionDescription(JSON.parse(offerJSON));
    handleSentConnectionOffer(userId, sender, offer);
  });

  connection.on("receiveAnswer", (sender: string, answerJSON: string) => {
    console.log("Received answer from", sender);
    const answer = new RTCSessionDescription(JSON.parse(answerJSON));
    handleSentConnectionAnswer(sender, answer);
  });

  connection.on(
    "receiveIceCandidate",
    (sender: string, candidateJSON: string) => {
      const candidate = new RTCIceCandidate(JSON.parse(candidateJSON));
      handleRemoteIceCandidate(sender, candidate);
    }
  );

  await connection.start();

  await broadcastConnection(userId);
}

export async function broadcastConnection(userId: string): Promise<Response> {
  console.log("Broadcasting connection as ", userId);
  return makeRequest("broadcastConnection", userId);
}

export async function sendWebRTCConnectionAnswer(
  userId: string,
  recipient: string,
  connectionAnswer: RTCSessionDescriptionInit
): Promise<Response> {
  console.log("Sending answer to ", recipient);
  return makeRequest("sendConnectionAnswer", userId, {
    recipient,
    answer: JSON.stringify(connectionAnswer, null, 2),
  });
}

export async function sendWebRTCConnectionOffer(
  userId: string,
  recipient: string,
  connectionOffer: RTCSessionDescriptionInit
): Promise<Response> {
  console.log("Sending connection offer to ", recipient);
  return makeRequest("sendConnectionOffer", userId, {
    recipient,
    offer: JSON.stringify(connectionOffer, null, 2),
  });
}

export async function sendSignalRMessage(caption: Caption): Promise<void> {
  // return makeRequest("sendMessage", { caption });
}

// TODO: We're not calling this!
export async function updateDisplayName(
  displayName: string,
  userId: string
): Promise<Response> {
  return makeRequest("updateDisplayName", userId, { displayName, userId });
}

export async function sendIceCandidate(
  userId: string,
  recipient: string,
  candidate: RTCIceCandidate
): Promise<Response> {
  console.log("Sending Ice candidate to ", recipient);

  return makeRequest("sendIceCandidate", userId, {
    recipient,
    candidate: JSON.stringify(candidate, null, 2),
  });
}

async function makeRequest(
  endpoint: string,
  userId: string,
  body?: any
): Promise<Response> {
  return fetch(`https://live-captions.azurewebsites.net/api/${endpoint}`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "x-ms-client-principal-id": userId,
    },
    body: JSON.stringify(body),
  });
}
