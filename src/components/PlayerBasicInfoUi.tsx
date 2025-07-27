"use client";

import React, {useEffect, useState} from 'react';
import gameManager from '@/utils/GameManager';
import { PlayerStat } from '@/utils/Utils';

const PlayerbasicInfoUi: React.FC = () => {
  const [currentPlayer, setCurrentPlayer] = useState<PlayerStat>({} as PlayerStat);

  useEffect(() => {
    const handlePlayerUpdate = (newPlayer: PlayerStat) => {
      setCurrentPlayer({...newPlayer});
    };

    gameManager.setCurrentPlayer = handlePlayerUpdate;

    return () => {
      gameManager.setCurrentPlayer = undefined;
    };
  }, []);

  return (
    <div style={{
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      width: 250,
      bottom: 10,
      left: 'calc(50% - 100px)',
    }}>
      <div style={{
        width: '100%',
        height: 30,
        position: 'relative',
        backgroundColor: '#44545acc',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 5,
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          top: 5,
          left: 5,
          right: 5,
          bottom: 5,
          position: 'absolute',
          gap: 5,
          alignItems: 'center',
        }}>
          <p style={{color: '#af9112', fontSize: 15}}>Lv.???</p>
          <p>{currentPlayer.name}</p>
        </div>
      </div>
      <div style={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        width: '100%',
        backgroundColor: '#e5e5e5',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        padding: 10,
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 5,
        }}>
          <p style={{color: '#999999', width: 30}}>HP</p>
          <div style={{
            backgroundColor: '#6b6368',
            position: 'relative',
            width: '100%',
            borderRadius: 5,
            height: 15,
          }}>
            <div style={{
              position: 'absolute',
              backgroundColor: '#f75c84',
              width: `${100 * currentPlayer.health / currentPlayer.maxHealth}%`,
              height: '100%',
              borderRadius: 5,
              transition: 'width 0.3s ease-in-out'
            }}/>
            <p style={{
              position: 'absolute',
              color: '#222',
              right: 0,
            }}>{currentPlayer.health}/{currentPlayer.maxHealth}</p>
          </div>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 5,
        }}>
          <p style={{color: '#999999', width: 30}}>MP</p>
          <div style={{
            backgroundColor: '#6b6368',
            position: 'relative',
            width: '100%',
            borderRadius: 5,
            height: 15,
          }}>
            <div style={{
              position: 'absolute',
              backgroundColor: '#a1ecfd',
              width: `${100 * currentPlayer.mana / currentPlayer.maxMana}%`,
              height: '100%',
              borderRadius: 5,
              transition: 'width 0.3s ease-in-out'
            }}/>
            <p style={{
              position: 'absolute',
              color: '#222',
              right: 0,
            }}>{currentPlayer.mana}/{currentPlayer.maxMana}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerbasicInfoUi;
