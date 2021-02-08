import React, { useState, useReducer, useEffect } from "react";
import { Header, InputForm, EmptyForm, Info, Softkeys } from "./components";
import { createPeer, destroyPeer, callPear } from "./peer-service";

const reducer = (state, action) => {
  switch (action.type) {
    case "LISTEN":
      return {
        ...state,
        me: action.data,
        status: "Listening"
      };
    case "CONNECT":
      return {
        ...state,
        contact: action.data,
        status: "Conversation"
      };
    case "REGISTER":
      return {
        ...state,
        me: "",
        contact: "",
        status: "Registration"
      };
    case "MESSAGE":
      return {
        ...state,
        message: action.data
      }
    default:
      return;
  }
};

const refs = {
  Registration: React.createRef(),
  Listening: React.createRef(),
  Conversation: React.createRef()
};

const getSoftKeyProps = status => {
  const map = {
    Registration: { left: null, center: "LISTEN", right: "Clear" },
    Listening: { left: "Register", center: "CONNECT", right: "Clear" },
    Conversation: { left: null, center: "TERMINATE", right: null }
  };

  return map[status];
};

const getAudio = () => {
  const audio = new Audio();
  audio.autoplay = true;
  return audio;
}

const App = () => {
  const [audio] = useState(getAudio());

  const[state, dispatch] = useReducer(reducer, {
    status: "Registration", 
    me: "",
    contact: "",
    message: "[empty]"
  });

  useEffect(
    () => refs[state.status].current.focus()
  );

  const handleListen = id => {
    createPeer(id, {
      open(id) {
        dispatch({ type: "LISTEN", data: id });
      },
      close() {
        dispatch({ type: "REGISTER" });
      },
      error(e) {
        dispatch({ type: "MESSAGE", data: e.message });
      },
      stream(remoteStream, rmCode) {
        audio.srcObject = remoteStream;
        dispatch({ type: "CONNECT", data: rmCode });
      }
    })
  };

  const handleConnect = id => {
    callPear(id, {
      stream(remoteStream) {
        audio.srcObject = remoteStream;
        dispatch({ type: "CONNECT", data: id });
      }
    });
  };

  const handleRegister = () => {
    destroyPeer();
  };

  return (
    <div>
      <Header title={state.status} />
      <InputForm
        ref={refs.Registration}
        label="Me"
        onSubmit={handleListen}
      />
      <InputForm
        ref={refs.Listening}
        label="Contact"
        onSubmit={handleConnect}
        onSoftLeft={handleRegister}
      />
      <EmptyForm
        ref={refs.Conversation}
        onSubmit={handleRegister}
      />
      <Info message={state.message} />
      <Softkeys {...getSoftKeyProps(state.status)} />
    </div>
  );
}

export default App;
