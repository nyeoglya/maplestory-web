import dynamic from 'next/dynamic';
import Image from "next/image";
import styles from "./page.module.css";

const DynamicPhaserGame = dynamic(() => import('../components/PhaserGame'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className={styles.page}>
      <DynamicPhaserGame />
    </div>
  );
}
