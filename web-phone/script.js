const localCode = document.querySelector("#local-code");
const remoteCode = document.querySelector("#remote-code");
const status = document.querySelector("#status");

const audio = new Audio();
audio.autoplay = true;

remoteCode.focus();

// Open connection with peer serwer (ws protocol)
const peer = new Peer(
  Math.random().toString(36).substr(2, 4).toUpperCase(),
  {
    // host: location.hostname,
    // port: 9000,
    // path: "/web-phone",
    debug: 2
  }
);

// Get local stream
let localStream;

navigator.mediaDevices.getUserMedia({ video: false, audio: true })
  .then(stream => {
    localStream = stream;
  }).catch(err => {
    status.value = err.message;
  });


// We use data channel to detect remote hangup
let dataConnection;

function setDataConnection(connection) {
  dataConnection = connection;
  dataConnection.on("data", data => {
    if (data === "HANGUP") {
      dataConnection.close();
      peer.destroy();
    }
  });
}

// Display local code after connection with peer server
peer.on("open", id => localCode.value = peer.id);

peer.on("error", err => status.value = err.message);

peer.on("close", () => status.value = "Finished");

peer.on("connection", setDataConnection);

peer.on("call", mediaConnection => {
  mediaConnection.answer(localStream);

  mediaConnection.on("stream", stream => {
    status.value = "Connected";
    remoteCode.value = mediaConnection.peer;
    audio.srcObject = stream;
  });
});

function onCall() {
  const rmCode = remoteCode.value;

  if (!rmCode) {
    status.value = "Missed code.";
    return;
  }

  setDataConnection(peer.connect(rmCode));

  const mediaConnection = peer.call(rmCode, localStream);
  mediaConnection.on("stream", stream => {
    status.value = "Connected";
    audio.srcObject = stream;
  });
}

function onHangup() {
  dataConnection.send("HANGUP");

  const timer = setInterval(() => {
    if (!dataConnection.open) {
      clearInterval(timer);
      peer.destroy();
    }
  }, 500);
}

document.addEventListener("keydown", event => {
  switch (event.key) {
    case "Enter":
      status.value === "Connected" ? onHangup() : onCall();
      return;
    default:
      return;
  }
});
