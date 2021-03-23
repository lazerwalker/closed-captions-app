import {
  sendWebRTCConnectionOffer,
  sendWebRTCConnectionAnswer,
  sendIceCandidate,
} from "./signalR";

const connections: { [userId: string]: RTCPeerConnection } = {};

export async function initiateWebRTCConnection(userId: string): Promise<void> {
  const peerConnection = new RTCPeerConnection();
  peerConnection.addEventListener("icecandidate", (event) => {
    sendIceCandidate(userId, event.candidate);
  });
  connections[userId] = peerConnection;
  const connectionOffer = await peerConnection.createOffer();
  peerConnection.setLocalDescription(connectionOffer);
  sendWebRTCConnectionOffer(userId, connectionOffer);
}

export async function handleSentConnectionOffer(
  sender: string,
  offer: RTCSessionDescription
): Promise<void> {
  // set local description
  // set remote description
  const peerConnection = new RTCPeerConnection();
  peerConnection.addEventListener("icecandidate", (event) => {
    sendIceCandidate(sender, event.candidate);
  });

  connections[sender] = peerConnection;

  peerConnection.setRemoteDescription(offer);

  const answer = await peerConnection.createAnswer();
  peerConnection.setLocalDescription(answer);
  sendWebRTCConnectionAnswer(sender, answer);
}

export async function handleSentConnectionAnswer(
  sender: string,
  answer: RTCSessionDescription
): Promise<void> {
  // set local description
  // set remote description
  const peerConnection = connections[sender];

  // other description
  peerConnection.setRemoteDescription(answer);
}

export async function handleRemoteIceCandidate(
  sender: string,
  candidate: RTCIceCandidate
): Promise<void> {
  const peerConnection = connections[sender];
  return peerConnection.addIceCandidate(candidate);
}
