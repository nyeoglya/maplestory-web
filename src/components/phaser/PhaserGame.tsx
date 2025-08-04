"use client";

import React, { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';

import BossScene from './scene/PhaserBossScene';
import WaitingScene from './scene/PhaserWaitingScene';
import BaseScene from './scene/PhaserBaseScene';
import TownScene from './scene/PhaserTownScene';

const PhaserGame = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialWidth = window.innerWidth;
    const initialHeight = window.innerHeight;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: initialWidth,
      height: initialHeight,
      parent: gameContainerRef.current as HTMLElement,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 500 },
          debug: true
        }
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
      },
      scene: [BaseScene, TownScene, WaitingScene, BossScene]
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.shiftKey || e.metaKey) e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);

    const game = new Phaser.Game(config);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      game.destroy(true);
    };
  }, []);

  return (
    <div
      ref={gameContainerRef}
      style={{
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    >
      {/* Phaser 게임이 렌더링되는 장소. */}
    </div>
  );
};

export default PhaserGame;
