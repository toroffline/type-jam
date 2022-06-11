import { h } from "preact";
import { StyleType } from "../../constants/style";

interface Props {
  enable: boolean;
  onClick: (val: boolean) => void;
  title: string;
  text?: {
    ["true"]: string;
    ["false"]: string;
  };
  style?: {
    ["true"]: StyleType;
    ["false"]: StyleType;
  };
  disabled?: boolean;
  glowing?: boolean;
}

export const ToggleButton = ({
  enable,
  onClick,
  text,
  title,
  style,
  glowing,
  disabled,
}: Props) => {
  return (
    <button
      type="button"
      class={`nes-btn ${
        disabled
          ? StyleType.Disabled
          : enable
          ? style
            ? style.false
            : ""
          : style
          ? style.true
          : ""
      } toggle-option ${glowing ? "glowing" : ""}`}
      disabled={disabled}
      onClick={() => onClick(!enable)}
    >
      {text ? text[(!enable).toString()] : ""} {title}
    </button>
  );
};

export default ToggleButton;
