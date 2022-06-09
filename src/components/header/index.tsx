import { Link } from "preact-router/match";
import styles from "./style.css";

const Header = () => {
  return (
    <header class={styles.header}>
      <h1>Type Jam</h1>
      <nav>
        <Link href="/profile">My Profile</Link>
      </nav>
    </header>
  );
};

export default Header;
