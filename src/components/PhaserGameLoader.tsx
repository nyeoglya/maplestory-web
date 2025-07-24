"use client";

import dynamic from 'next/dynamic';
import React from 'react';

const DynamicPhaserGame = dynamic(() => import('./PhaserGame'), {
  ssr: false,
  loading: () => {
    return (
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
          justifyContent: 'center'
        }}
      >
        <p>Maplestory Web v0.1</p>
        <p>Loading game...</p>
      </div>
    );
  },
});

const PhaserGameLoader = () => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
    }}>
      <DynamicPhaserGame />
    </div>
  );
};

export default PhaserGameLoader;
