## Audio call via WebRTC for KaiOS

See also:
https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Build_a_phone_with_peerjs

#### Install and run peer server:
```
cd ../peerjs-server
npm i
npm start
```

#### Install and run dev sever:
```
cd ../dev-server
npm start
```

#### Open two separate browser windows:
```
http://127.0.0.1:3000/
```

#### Get peer list
```
http://127.0.0.1:9000/web-phone/peerjs/peers
```

#### Build React application
```
GENERATE_SOURCEMAP=false yarn build
```
