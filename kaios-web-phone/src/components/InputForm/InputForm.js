import React, { useState } from "react";
import { keys } from "../../config";

const InputForm = React.forwardRef((props, ref) => {
  const { label, onSubmit, onSoftLeft, isActive, code } = props;

  const [value, setValue] = useState("");

  const handleChange = event => {
    setValue(event.target.value);
  };

  const handleKey = event => {
    switch (event.key) {
      case keys.right:
        setValue("");
        return;
      case keys.left:
        onSoftLeft && onSoftLeft();
        return;
      default:
        return;
    }
  }

  const handleSubmit = event => {
    const trimmedValue = value.trim();
    if (trimmedValue) {
      onSubmit(trimmedValue);
    }
    event.preventDefault();
  };

  const input = (
    <input
      ref={ref}
      type="text"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKey}
    />
  );

  const id = (<span>{code}</span>);

  return (
    <form onSubmit={handleSubmit}>
      <label>
        {label}{": "}
        {isActive ? input : id}
      </label>
    </form>
  );
});

export { InputForm };
