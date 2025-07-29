"use client";

import React, { useEffect } from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
/*
import GameScreenUi from "@/components/ui/GameScreenUi";
import PhaserGameLoader from "@/components/phaser/PhaserGameLoader";
import GameEndUi from '@/components/ui/GameEndUi';
*/
import dynamic from 'next/dynamic';

const GameScreenUi = dynamic(() => import('@/components/ui/GameScreenUi'), { ssr: false });
const PhaserGameLoader = dynamic(() => import('@/components/phaser/PhaserGameLoader'), { ssr: false });
const GameEndUi = dynamic(() => import('@/components/ui/GameEndUi'), { ssr: false });

function Home() {
  useEffect(() => {
    console.log({ GameScreenUi, PhaserGameLoader, GameEndUi });
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div>
            <GameScreenUi />
            <PhaserGameLoader />
          </div>
        } />
        <Route path="/end" element={<GameEndUi />} />
      </Routes>
    </Router>
  );
}

export default Home;
