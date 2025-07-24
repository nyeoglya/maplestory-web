import PhaserGameLoader from "@/components/PhaserGameLoader";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <PhaserGameLoader />
    </div>
  );
}
