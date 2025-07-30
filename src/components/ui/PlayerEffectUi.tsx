"use client";

import React, { useEffect, useState } from 'react';
import gameManager from '@/utils/manager/GameManager';
import Image from 'next/image';
import { Effect } from '@/utils/Effect';

const PlayerEffectUi: React.FC = () => {
  const [currentEffect, setCurrentEffect] = useState<Effect[]>([]);
  const [hoveredEffect, setHoveredEffect] = useState<Effect | null>(null); // TODO: 이거 더 깔끔하게 바꾸기

  useEffect(() => {
    const handleEffectListUpdate = (newEffectList: Effect[]) => {
      setCurrentEffect([...newEffectList]);
    };

    gameManager.effectManager.setCurrentEffect = handleEffectListUpdate;

    return () => {
      gameManager.effectManager.setCurrentEffect = undefined;
    };
  }, []);

  useEffect(() => { // TODO: 이건 임시방편임
    setHoveredEffect(null);
  }, [currentEffect]);

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
        pointerEvents: 'auto',
      }}
    >
      {(hoveredEffect && <div
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          top: 60,
          right: 5,
          background: '#00000044',
          width: 250,
          height: 100,
          padding: '5px 8px',
          borderRadius: '4px',
        }}
      >
        <p style={{ color: 'white', fontSize: 20, }}>{hoveredEffect.name}</p>
        <p style={{ color: 'white', fontSize: 15, }}>{hoveredEffect.description}</p>
      </div>
      )}
      {currentEffect.map((effect) => {
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
              margin: '4px',
            }}
            onMouseEnter={() => setHoveredEffect(effect)}
            onMouseLeave={() => setHoveredEffect(null)}
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
            <p
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: iconSize,
                height: iconSize,
                zIndex: 1,
                fontSize: '12px',
                color: 'white',
                backgroundColor: 'rgba(0,0,0,0.4)',
                textAlign: 'center',
                lineHeight: `${iconSize}px`,
                pointerEvents: 'none',
              }}
            >
              {effect.duration}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default PlayerEffectUi;
