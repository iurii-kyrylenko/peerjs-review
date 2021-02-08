import React from "react";

export const reducer = (state, action) => {
  switch (action.type) {
    case "LISTEN":
      return {
        ...state,
        me: action.data,
        status: "Listening",
        error: ""
      };
    case "CONNECT":
      return {
        ...state,
        contact: action.data,
        status: "Conversation",
        error: ""
      };
    case "REGISTER":
      return {
        ...state,
        me: "",
        contact: "",
        status: "Registration",
      };
    case "ERROR":
      return {
        ...state,
        error: action.data
      }
    default:
      return;
  }
};

export const refs = {
  Registration: React.createRef(),
  Listening: React.createRef(),
  Conversation: React.createRef()
};

export const getSoftKeyProps = status => {
  const map = {
    Registration: { left: null, center: "LISTEN", right: "Clear" },
    Listening: { left: "Register", center: "CONNECT", right: "Clear" },
    Conversation: { left: null, center: "TERMINATE", right: null }
  };
  return map[status];
};

export const getInfo = status => {
  const map = {
    Registration: "Please, input your code.",
    Listening: "Wait for conversation or connect to yor contact.",
    Conversation: "Talk to contact."
  };
  return map[status];
};

export const getAudio = () => {
  const audio = new Audio();
  audio.autoplay = true;
  return audio;
}
