import React from "react"

const Info = ({ text, isMessage }) => {
  const style = isMessage ? { color: "red" } : {};

  return (
    <div>
      <span style={style}>{text}</span>
    </div>
  );
};

export { Info };
