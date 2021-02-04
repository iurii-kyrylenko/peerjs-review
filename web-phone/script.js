const localCode = document.querySelector("#local-code");
const remoteCode = document.querySelector("#remote-code");
const btnCall = document.querySelector("#btn-call");
const btnHangup = document.querySelector("#btn-hangup");
const audio = document.querySelector("#audio");
const status = document.querySelector("#status");

let localStream;

// Open connection with peer serwer (ws protocol)
const peer = new Peer(
  Math.random().toString(36).substr(2, 4).toUpperCase(), {
  host: location.hostname,
  port: 9000,
  path: '/web-phone',
  debug: 2
});

// Display local code after connection with peer server
peer.on("open", id => localCode.value = peer.id);

peer.on('error', err => status.value = err.message);

peer.on("close", () => status.value = "Finished");

// Get local strem
navigator.mediaDevices.getUserMedia({ video: false, audio: true })
  .then(stream => {
    localStream = stream;
  }).catch(err => {
    console.error(err);
  });

btnCall.addEventListener("click", () => {
  const rmCode = remoteCode.value;

  if (!rmCode) {
    status.value = "Missed code.";
    return;
  }

  const mediaConnection = peer.call(rmCode, localStream);

  mediaConnection.on("stream", stream => {
    status.value = "Connected";
    audio.srcObject = stream;
  });
});

btnHangup.addEventListener("click", () => {
  peer.destroy();
});

peer.on('call', mediaConnection => {
  mediaConnection.answer(localStream);

  mediaConnection.on('stream', stream => {
    status.value = "Connected";
    audio.srcObject = stream;
  });
});
