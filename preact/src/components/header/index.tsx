import { Link } from "preact-router/match";
import styles from "./style.css";

const Header = () => {
  return (
    <nav style="padding: 10px; border-bottom: 3px solid #ccc; margin-bottom: 25px;">
      <h2 onClick={() => window.location.reload()}>
        <i class="nes-icon coin" style={{ marginRight: "30px" }} />
        Type Jam
      </h2>
    </nav>
  );
};

export default Header;
