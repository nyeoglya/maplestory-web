import Image from "next/image";
import styles from "./page.module.css";
import PhaserGame from '../components/PhaserGame';

export default function Home() {
  return (
    <div className={styles.page}>
      <PhaserGame />
    </div>
  );
}
