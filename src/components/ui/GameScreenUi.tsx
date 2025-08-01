"use client";

import React from 'react';

import PlayerbasicInfoUi from './PlayerBasicInfoUi';
import PlayerEffectUi from './PlayerEffectUi';
import PlayerSkillUi from './PlayerSkillUi';
import BossEntityUi from './BossEntityUi';
import MesoCountUi from './MesoCountUi';
import DraggableItem from '@/windows/DraggableItem';
import DeathCountUi from './DeathCountUi';
import CaptchaWindow from '@/windows/CaptchaWindow';
import BossPhaseClockWindow from '@/windows/BossPhaseClockWindow';
import InventoryWindow from '@/windows/InventoryWindow';
import ArmorWindow from '@/windows/ArmorWindow';

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
      <BossPhaseClockWindow />
      <CaptchaWindow />
      <ArmorWindow />
      <InventoryWindow />
      <DraggableItem />
      <div style={{
        position: 'absolute',
        width: '100%',
        height: 10,
        top: 0,
        left: 0,
      }}>
        <BossEntityUi />
        <DeathCountUi />
        <MesoCountUi />
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
        <PlayerSkillUi />
      </div>
    </div>
  );
};

export default GameScreenUi;
