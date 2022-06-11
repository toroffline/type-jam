import { h } from "preact";

interface Props {
  enable: boolean;
  setEnable: (val: boolean) => void;
  text: {
    ["true"]: string;
    ["false"]: string;
  };
}

export const ToggleButton = ({ enable, setEnable, text }: Props) => {
  return (
    <div className="toggle-hint mb-2">
      <button
        type="button"
        class={`nes-btn ${enable ? "" : "is-success"}`}
        onClick={() => setEnable(!enable)}
      >
        {text[(!enable).toString()]} Hint
      </button>
    </div>
  );
};

export default ToggleButton;
