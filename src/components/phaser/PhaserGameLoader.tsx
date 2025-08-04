"use client";

import dynamic from 'next/dynamic';
import React, { useState } from 'react';

const DynamicPhaserGame = dynamic(() => import('./PhaserGame'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <p>Loading game...</p>
    </div>
  ),
});

const PhaserGameLoader = () => {
  const [started, setStarted] = useState(false);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      {!started ? (
        <>
          <p>Maplestory Web v0.2</p>
          <button
            onClick={() => setStarted(true)}
            style={{
              marginTop: 20,
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            게임 시작
          </button>
        </>
      ) : (
        <DynamicPhaserGame />
      )}
    </div>
  );
};

export default PhaserGameLoader;
