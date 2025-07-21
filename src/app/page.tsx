import React from 'react';

import LoginForm from "../components/LoginForm";
import GameScreenUi from "../components/GameScreenUi";
import PhaserGameLoader from "../components/PhaserGameLoader";

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
