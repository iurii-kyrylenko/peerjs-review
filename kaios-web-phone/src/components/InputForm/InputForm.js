import React, { useState } from "react"

const InputForm = React.forwardRef(({ label, input, onSubmit, onSoftLeft }, ref) => {
  const [value, setValue] = useState(input);

  const handleChange = event => {
    setValue(event.target.value);
  };

  const handleKey = event => {
    switch (event.key) {
      case "ArrowRight":
        setValue("");
        return;
      case "ArrowLeft":
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

  return (
    <form onSubmit={handleSubmit}>
      <label>
        {label}
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKey}
        />
      </label>
    </form>
  );
});

export { InputForm };
