"use client";

import dynamic from 'next/dynamic';
import React from 'react';

const DynamicPhaserGame = dynamic(() => import('./PhaserGame'), {
  ssr: false,
  loading: () => <p>Loading game...</p>,
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
