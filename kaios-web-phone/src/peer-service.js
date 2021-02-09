import Peer from "peerjs";

const WAIT_FOR_ANSWER_MS = 2000; // 1

let peer = null;
let localStream = null;
let callAnswered = false; // 2

export function createPeer(code, cb) {
  peer = new Peer(
    code, {
    // host: window.location.hostname,
    // port: 9000,
    // path: '/web-phone',
    debug: 2
  });

  peer.on("open", id => {
    navigator.mediaDevices.getUserMedia({ video: false, audio: true })
      .then(stream => localStream = stream)
      .then(() => callAnswered = false) // 3
      .then(() => cb.open(id))
      .catch(err => cb(err));
  });

  peer.on("close", () => {
    localStream && localStream.getTracks().forEach(t => t.stop());
    cb.close();
  });

  peer.on("error", err => cb.error(err));

  peer.on("call", mediaConnection => {
    // Remote peer answers to only one call
    if (callAnswered) { // 4
      return;
    }
    callAnswered = true; // 5

    mediaConnection.answer(localStream);
    const rmCode = mediaConnection.peer;
    mediaConnection.on("stream", stream => cb.stream(stream, rmCode));
  });
}

export function destroyPeer() {
  peer.destroy();
}

export function callPear(rmCode, cb) {
  const mediaConnection = peer.call(rmCode, localStream);

  // Wait for remote stream
  const timeout = setTimeout( // 6
    () => !mediaConnection.open && cb.timeout(),
    WAIT_FOR_ANSWER_MS
  );

  mediaConnection.on("stream", stream => {
    clearTimeout(timeout); // 7
    cb.stream(stream);
  });
}
