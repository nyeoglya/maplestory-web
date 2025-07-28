import React from 'react';

import GameScreenUi from "@/components/ui/GameScreenUi";
import PhaserGameLoader from "@/components/phaser/PhaserGameLoader";

// import {MdHome} from 'react-icons/md';
// <MdHome size="24" color="blue" />

function Home() {
  return (
    <div>
      <GameScreenUi />
      {/*<LoginForm />*/}
      <PhaserGameLoader />
    </div>
  );
}

export default Home;
