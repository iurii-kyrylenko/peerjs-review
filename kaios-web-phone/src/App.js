import React, { useReducer, useEffect } from "react";
import { Header, InputForm, EmptyForm, Info, Softkeys } from "./components"

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
        status: "Registration"
      };
    default:
      return;
  }
};

const refs = {
  Registration: React.createRef(),
  Listening: React.createRef(),
  Conversation: React.createRef()
};

const App = () => {
  const[state, dispatch] = useReducer(reducer, {
    status: "Registration", 
    me: "",
    contact: "",
    message: "[empty]"
  });

  // const refs = {
  //   Registration: React.createRef(),
  //   Listening: React.createRef(),
  //   Conversation: React.createRef()
  // };
  
  useEffect(
    () => refs[state.status].current.focus()
  );

  const getSoftKeyProps = status => {
    const map = {
      Registration: { left: null, center: "LISTEN", right: "Clear" },
      Listening: { left: "Register", center: "CONNECT", right: "Clear" },
      Conversation: { left: null, center: "TERMINATE", right: null }
    };

    return map[status];
  };

  return (
    <div>
      <Header title={state.status} />
      <InputForm
        ref={refs.Registration}
        label="Me"
        input={state.me}
        onSubmit={data => dispatch({ type: "LISTEN", data })}
      />
      <InputForm
        ref={refs.Listening}
        label="Contact"
        input={state.contact}
        onSubmit={data => dispatch({ type: "CONNECT", data })}
        onSoftLeft={() => dispatch({ type: "REGISTER" })}
      />
      <EmptyForm
        ref={refs.Conversation}
        onSubmit={() => dispatch({ type: "REGISTER" })}
      />
      <Info message={state.message} />
      <Softkeys {...getSoftKeyProps(state.status)} />
    </div>
  );
}

export default App;
