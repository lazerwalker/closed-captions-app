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
    initiateWebRTCConnection(broadcastUserId);
  });

  connection.on("receiveOffer", (sender: string, offerJSON: string) => {
    const offer = new RTCSessionDescription(JSON.parse(offerJSON));
    handleSentConnectionOffer(sender, offer);
  });

  connection.on("receiveAnswer", (sender: string, answerJSON: string) => {
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

  connection.on("text", (caption: Caption) => {
    dispatch(receivedRemoteCaptionAction(caption));
    sendWebSocketCaption(caption);
  });

  connection.on("updateDisplayName", (displayName: string, userId: string) => {
    dispatch(updateDisplayNameAction(displayName, userId));
    sendWebSocketDisplayName(displayName, userId);
  });

  await connection.start();
}

export async function sendWebRTCConnectionAnswer(
  userId: string,
  connectionAnswer: RTCSessionDescriptionInit
): Promise<Response> {
  return makeRequest("sendConnectionAnswer", {
    recipient: userId,
    answer: JSON.stringify(connectionAnswer, null, 2),
  });
}

export async function sendWebRTCConnectionOffer(
  userId: string,
  connectionOffer: RTCSessionDescriptionInit
): Promise<Response> {
  return makeRequest("sendConnectionOffer", {
    recipient: userId,
    offer: JSON.stringify(connectionOffer, null, 2),
  });
}

export async function sendSignalRMessage(caption: Caption): Promise<Response> {
  // return makeRequest("sendMessage", { caption });
}

export async function updateDisplayName(
  displayName: string,
  userId: string
): Promise<Response> {
  return makeRequest("updateDisplayName", { displayName, userId });
}

export async function sendIceCandidate(
  recipient: string,
  candidate: RTCIceCandidate
): Promise<Response> {
  return makeRequest("sendIceCandidate", {
    recipient: recipient,
    candidate: JSON.stringify(candidate, null, 2),
  });
}

async function makeRequest(endpoint: string, body: any): Promise<Response> {
  return fetch(`https://live-captions.azurewebsites.net/api/${endpoint}`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
