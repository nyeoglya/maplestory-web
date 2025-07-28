"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import gameManager from '@/utils/manager/GameManager';

const BossEntityUi: React.FC = () => {
  const [currentHealth, setCurrentHealth] = useState<number>(50);
  const [bossTimer, setBossTimer] = useState<number>(30 * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      const boss = gameManager.bossEntity;
      if (!boss) return;
      setCurrentHealth(50 * boss.currentHealth / boss.maxHealth);
      setBossTimer(boss.bossTimeLeft);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
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
        backgroundColor: '#434346',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
      }} />
      <div style={{
        position: 'absolute',
        left: '25%',
        width: `${currentHealth}%`,
        height: 15,
        backgroundColor: '#eb2204',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
      }} />
      <div style={{
        position: 'absolute',
        left: '25%',
        width: '50%',
        height: 15,
        borderWidth: 1,
        borderColor: '#8d8180',
        border: 'solid',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
      }} />
      <div style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        width: 230,
        top: 40,
        left: 'calc(50% - 100px)',
        backgroundColor: '#0a070799',
        padding: 15,
        gap: 10,
        borderRadius: 5,
      }}>
        <p style={{
          fontSize: 12
        }}>남은 시간</p>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 2,
        }}>
          <p style={{ color: '#ddb562', fontSize: 25, }}>{Math.floor(bossTimer / 60)}</p>
          <p style={{ color: 'white', fontSize: 12, marginBottom: 5, marginRight: 10 }}>분</p>
          <p style={{ color: '#ddb562', fontSize: 25, }}>{String(bossTimer % 60).padStart(2, '0')}</p>
          <p style={{ color: 'white', fontSize: 12, marginBottom: 5 }}>초</p>
        </div>
      </div>
    </div>
  );
};

export default BossEntityUi;
