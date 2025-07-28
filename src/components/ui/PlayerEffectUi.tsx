"use client";

import React, { useEffect, useState } from 'react';
import gameManager from '@/utils/manager/GameManager';
import Image from 'next/image';
import { Effect } from '@/utils/Effect';

const PlayerEffectUi: React.FC = () => {
  const [currentEffect, setCurrentEffect] = useState<Effect[]>([]);
  const [hoveredEffectName, setHoveredEffectName] = useState<string | null>(null);

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
            onMouseEnter={() => {
              console.log(effect.name);
              setHoveredEffectName(effect.name);
            }}
            onMouseLeave={() => setHoveredEffectName(null)}
          >
            <Image
              src={effect.effectIconPath}
              alt={`Effect ${effect.name}`}
              width={iconSize}
              height={iconSize}
              style={{
                objectFit: 'cover',
                display: 'block',
                pointerEvents: 'none',
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
            {hoveredEffectName === effect.name && (
              <div
                style={{
                  position: 'absolute',
                  top: iconSize + 5,
                  left: 0,
                  background: 'rgba(0, 0, 0, 0.8)',
                  color: '#fff',
                  padding: '5px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  zIndex: 10,
                  whiteSpace: 'nowrap',
                }}
              >
                {effect.description || effect.name}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PlayerEffectUi;
