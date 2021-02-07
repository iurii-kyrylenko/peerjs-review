const localCode = document.querySelector("#local-code");
const remoteCode = document.querySelector("#remote-code");
const status = document.querySelector("#status");
// const btnCall = document.querySelector("#btn-call");
// const btnHangup = document.querySelector("#btn-hangup");
// const audio = document.querySelector("#audio");

const audio = new Audio();
audio.autoplay = true;

remoteCode.focus();

let localStream;

// Open connection with peer serwer (ws protocol)
const peer = new Peer(
  Math.random().toString(36).substr(2, 4).toUpperCase(), {
  // host: location.hostname,
  // port: 9000,
  // path: '/web-phone',
  debug: 2
});

// Display local code after connection with peer server
peer.on("open", id => localCode.value = peer.id);

peer.on('error', err => status.value = err.message);

peer.on("close", () => status.value = "Finished");

// Get local stream
navigator.mediaDevices.getUserMedia({ video: false, audio: true })
  .then(stream => {
    localStream = stream;
  }).catch(err => {
    status.value = err.message;
  });

function onCall() {
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
}

function onHangup() {
  peer.destroy();
}

// btnCall.addEventListener("click", onCall);
// btnHangup.addEventListener("click", onHangup);

document.addEventListener("keydown", event => {
  switch (event.key) {
    case "Enter":
      status.value === "Connected" ? onHangup() : onCall();
      return;
    default:
      return;
  }
});

peer.on('call', mediaConnection => {
  mediaConnection.answer(localStream);

  mediaConnection.on('stream', stream => {
    status.value = "Connected";
    audio.srcObject = stream;
  });
});
