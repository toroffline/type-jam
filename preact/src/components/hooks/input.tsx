import { h } from "preact";
import { useState } from "preact/hooks";

const useInput = (inputRef) => {
  const [value, setValue] = useState("");
  const clear = () => setValue("");

  const input = (
    <input
      ref={inputRef}
      value={value}
      onKeyUp={(e) => setValue((e.target as HTMLInputElement).value)}
      type="text"
      className="nes-input"
    />
  );

  return [value, input, clear];
};

export default useInput;
