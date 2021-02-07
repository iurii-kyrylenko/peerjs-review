import React from "react"

const Softkeys = ({ left, center, right }) => {
  return (
    <div>
      <label>{left}</label>
      {" | "}
      <label>{center}</label>
      {" | "}
      <label>{right}</label>
    </div>
  );
};

export { Softkeys };
