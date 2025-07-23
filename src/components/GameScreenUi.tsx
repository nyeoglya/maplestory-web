"use client";

import React from 'react';
import Image from 'next/image';

import PlayerbasicInfoUi from './PlayerBasicInfoUi';
import PlayerEffectUi from './PlayerEffectUi';
import PlayerSkillUi from './PlayerSkillUi';
import DraggableItem from '@/windows/DraggableItem';

const GameScreenUi: React.FC = () => {
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
      {/*
      <ArmorWindow />
      <InventoryWindow />
      */}
      <DraggableItem />
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
        <PlayerSkillUi />
      </div>
    </div>
  );
};

export default GameScreenUi;
