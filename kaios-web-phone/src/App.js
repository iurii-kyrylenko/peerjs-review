import { useState, useReducer, useEffect } from "react";
import { Header, InputForm, EmptyForm, Info, Softkeys } from "./components";
import { createPeer, destroyPeer, callPear } from "./peer-service";
import * as u from "./utils";

const App = () => {
  const [audio] = useState(u.getAudio());

  const[state, dispatch] = useReducer(u.reducer, {
    status: "Registration", 
    me: "",
    contact: "",
    error: ""
  });

  useEffect(() =>
    u.refs[state.status].current.focus()
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
        dispatch({ type: "ERROR", data: e.message });
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

  const handleRegister = () =>  destroyPeer();

  return (
    <div>
      <Header title={state.status} />
      <InputForm
        ref={u.refs.Registration}
        label="Me"
        onSubmit={handleListen}
        isActive={state.status === "Registration"}
        code={state.me}
      />
      <InputForm
        ref={u.refs.Listening}
        label="Contact"
        onSubmit={handleConnect}
        onSoftLeft={handleRegister}
        isActive={state.status === "Listening"}
        code={state.contact}
      />
      <EmptyForm
        ref={u.refs.Conversation}
        onSubmit={handleRegister}
      />
      <Info message={u.getInfo(state.status)} />
      <Info isError={true} message={state.error} />
      <Softkeys {...u.getSoftKeyProps(state.status)} />
    </div>
  );
}

export default App;
