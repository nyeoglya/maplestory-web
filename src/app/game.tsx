import PhaserGameLoader from "@/components/phaser/PhaserGameLoader";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <PhaserGameLoader />
    </div>
  );
}
