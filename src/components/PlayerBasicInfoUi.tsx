"use client";

import React, {useState} from 'react';
import gameManager from '@/utils/GameManager';

const PlayerbasicInfoUi: React.FC = () => {
  return (
    <div style={{
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      width: 200,
      bottom: 10,
      left: 'calc(50% - 100px)',
      alignItems: 'center',
    }}>
      <div style={{
        width: '100%',
        height: 30,
        backgroundColor: 'gray',
        padding: 5,
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          position: 'absolute',
          gap: 5,
        }}>
          <p>Lv.???</p>
          <p>{gameManager.player.name}</p>
        </div>
      </div>
      <div style={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        width: '100%',
        backgroundColor: 'white',
        padding: 10,
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 5,
        }}>
          <p style={{color: 'black', width: 30}}>HP</p>
          <div style={{
            backgroundColor: 'blue',
            width: `${100*gameManager.player.health/gameManager.player.maxHealth}%`,
            height: 20,
          }}/>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 5,
        }}>
          <p style={{color: 'black', width: 30}}>MP</p>
          <div style={{
            backgroundColor: 'red',
            width: `${100*gameManager.player.mana/gameManager.player.maxMana}%`,
            height: 20,
          }}/>
        </div>
      </div>
    </div>
  );
};

export default PlayerbasicInfoUi;
