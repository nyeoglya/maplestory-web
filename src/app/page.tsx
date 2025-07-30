import React from 'react';

import GameScreenUi from "@/components/ui/GameScreenUi";
import PhaserGameLoader from "@/components/phaser/PhaserGameLoader";

function Home() {
  return (
    <div>
      <GameScreenUi />
      <PhaserGameLoader />
    </div>
  );
}

export default Home;
