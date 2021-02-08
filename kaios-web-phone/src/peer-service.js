import Peer from "peerjs";

let peer = null;
let localStream = null;

export function createPeer(code, cb) {
  navigator.mediaDevices.getUserMedia({ video: false, audio: true })
    .then(stream => localStream = stream)
    .catch(err => cb(err.message));

  peer = new Peer(
    code, {
    host: window.location.hostname,
    port: 9000,
    path: '/web-phone',
    debug: 2
  });

  peer.on("open", id => cb.open(id));
  peer.on("close", () => cb.close());
  peer.on("error", err => cb.error(err));

  peer.on("call", mediaConnection => {
    mediaConnection.answer(localStream);
    const rmCode = mediaConnection.peer;
    mediaConnection.on("stream", stream => cb.stream(stream, rmCode));
  });
}

export function destroyPeer() {
  peer.destroy();
  localStream.getTracks().forEach(t => t.stop());
}

export function callPear(rmCode, cb) {
  const mediaConnection = peer.call(rmCode, localStream);
  mediaConnection.on("stream", stream => cb.stream(stream));
}
