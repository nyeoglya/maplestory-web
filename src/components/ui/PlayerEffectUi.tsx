"use client";

import React, { useEffect, useState } from 'react';
import gameManager from '@/utils/manager/GameManager';
import Image from 'next/image';
import { Effect } from '@/utils/Effect';

const PlayerEffectUi: React.FC = () => {
  const [currentEffect, setCurrentEffect] = useState<Effect[]>([]);

  useEffect(() => {
    const handleEffectListUpdate = (newEffectList: Effect[]) => {
      setCurrentEffect([...newEffectList]);
    };

    gameManager.effectManager.setCurrentEffect = handleEffectListUpdate;

    return () => {
      gameManager.effectManager.setCurrentEffect = undefined;
    };
  }, []);

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
      {currentEffect.map(effect => {
        const iconSize = 50;
        return (
          <div
            key={effect.name}
            style={{
              position: 'relative',
              width: iconSize,
              height: iconSize,
              overflow: 'hidden',
              borderRadius: '5px',
            }}
          >
            <Image
              src={effect.effectIconPath}
              alt={`Effect ${effect.name}`}
              width={iconSize}
              height={iconSize}
              style={{
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <p style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: iconSize,
              height: iconSize,
              zIndex: 2,
            }}>{effect.duration}</p>
          </div>
        );
      })}
    </div>
  );
};

export default PlayerEffectUi;
