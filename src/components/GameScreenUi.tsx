"use client";

import React from 'react';
import Image from 'next/image';

import PlayerbasicInfoUi from './PlayerBasicInfoUi';
import PlayerEffectUi from './PlayerEffectUi';
import PlayerSkillUi from './PlayerSkillUi';
import BossEntityUi from './BossEntityUi';
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
      <DraggableItem />
      */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: 10,
        top: 0,
        left: 0,
      }}>
        <BossEntityUi />
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
