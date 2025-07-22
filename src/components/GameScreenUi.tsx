"use client";

import React, {useState, useEffect} from 'react';
import Image from 'next/image';

import PlayerbasicInfoUi from './PlayerBasicInfoUi';
import PlayerEffectUi from './PlayerEffectUi';
import DraggableCircle from '@/windows/DraggableCircle';
import InventoryWindow from '@/windows/InventoryWindow';
import ArmorWindow from '@/windows/ArmorWindow';

const GameScreenUi: React.FC = () => {

  const handleKeyDown = (event: KeyboardEvent) => {
    // event.preventDefault();
    if (event.key.toLowerCase() === 'i') {
      console.log("i 키가 감지되었습니다!");
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 999,
      pointerEvents: 'none',
    }}>
      <InventoryWindow />
      <ArmorWindow />
      <div style={{
        position: 'absolute',
        width: '100%',
        height: 10,
        top: 0,
        left: 0,
      }}>
        <Image
          id='bossFace'
          key='bossFace'
          src={'/assets/bossFace.jpg'}
          alt={`bossFace`}
          width={40}
          height={40}
          style={{
            objectFit: 'cover',
            position: 'absolute',
            left: 'calc(25% - 40px)',
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
          }}
        />
        <div id='bossHealthBar' style={{
          position: 'absolute',
          left: '25%',
          width: '50%',
          height: 15,
          backgroundColor: 'gray'
        }}></div>
        <div style={{
          position: 'absolute',
          left: '25%',
          width: '10%',
          height: 15,
          backgroundColor: 'white'
        }}></div>
        <div style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          width: 200,
          top: 40,
          left: 'calc(50% - 100px)',
          backgroundColor: 'green',
          alignItems: 'center',
        }}>
          <p>남은 시간</p>
          <p id='bossRemainingTime'>30분 00초</p>
        </div>
        <PlayerEffectUi />
      </div>
      <div style={{
        position: 'absolute',
        width: '100%',
        bottom: 0,
        left: 0,
        height: 10,
      }}>
        <PlayerbasicInfoUi />
        <div style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'row',
          left: '10%',
          bottom: 0,
          backgroundColor: 'orange',
          width: 'calc(25% - 100px)',
          height: 50
        }}>
          <div style={{
            position: 'absolute',
            right: 0,
            backgroundColor: 'lightblue',
            width: 50,
            height: 50
          }}></div>
        </div>
        <div style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'row',
          right: 0,
          bottom: 0,
          backgroundColor: 'purple',
          width: '25%',
          height: 80
        }}>
          <div style={{
            position: 'absolute',
            right: 0,
            backgroundColor: 'yellow',
            width: 40,
            height: 40
          }}></div>
        </div>
      </div>
    </div>
  );
};

export default GameScreenUi;
