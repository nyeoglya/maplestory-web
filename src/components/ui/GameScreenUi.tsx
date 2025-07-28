"use client";

import React from 'react';

import PlayerbasicInfoUi from './PlayerBasicInfoUi';
import PlayerEffectUi from './PlayerEffectUi';
import PlayerSkillUi from './PlayerSkillUi';
import BossEntityUi from './BossEntityUi';
import SettingBtnUi from './SettingBtnUi';
import DraggableItem from '@/windows/DraggableItem';
import DeathCountUi from './DeathCountUi';
import CaptchaWindow from '@/windows/CaptchaWindow';
import BossPhaseClockWindow from '@/windows/BossPhaseClockWindow';

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
      {/*
      <CaptchaWindow />
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
        <DeathCountUi />
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
        <SettingBtnUi />
        <PlayerSkillUi />
      </div>
    </div>
  );
};

export default GameScreenUi;
