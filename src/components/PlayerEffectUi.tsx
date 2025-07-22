"use client";

import React from 'react';
import gameManager from '@/utils/GameManager';
import Image from 'next/image';

const PlayerEffectUi: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        alignContent: 'flex-start',
        right: 0,
        width: '25%',
        height: 500,
        padding: '5px',
        boxSizing: 'border-box',
        overflowY: 'hidden',
      }}
    >
      {gameManager.effectManager.currentPlayerEffect.map(effect => (
        <Image
          key={effect.name}
          src={`${effect.effectIconPath}`}
          alt={`Effect ${effect.name}`}
          width={50}
          height={50}
          style={{
            objectFit: 'cover',
          }}
        />
      ))}
    </div>
  );
};

export default PlayerEffectUi;
