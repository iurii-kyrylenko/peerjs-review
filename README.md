## Audio call via WebRTC for KaiOS

See also:
https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Build_a_phone_with_peerjs

#### Install and run peer server:
cd ../peerjs-server
```
npm i
npm start
```

#### Install and rundev sever:
```
cd ../dev-server
npm start
```

#### Open two separate browser windows:
```
http://127.0.0.1:3000/
```

Sometimes:
```
peerjs-1.3.1.min.js:48 ERROR PeerJS:
Error: (InvalidStateError) Failed to execute 'setRemoteDescription' on 'RTCPeerConnection':
Failed to set remote answer sdp: Called in wrong state: stable
```
