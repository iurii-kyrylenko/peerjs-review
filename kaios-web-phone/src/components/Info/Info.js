import React from "react"

const Info = ({ message, isError }) => {
  const style = isError ? { color: "red" } : {};

  return (
    <div>
      <span style={style}>{message}</span>
    </div>
  );
};

export { Info };
