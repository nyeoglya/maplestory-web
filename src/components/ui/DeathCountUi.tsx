"use client";

import { useNavigate } from 'react-router-dom';
import gameManager from '@/utils/manager/GameManager';
import React, { useEffect, useState } from 'react';

const DeathCountUi: React.FC = () => {
  const navigate = useNavigate();
  const [deathCount, setDeathCount] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDeathCount(gameManager.deathCount);
      if (gameManager.deathCount <= 0 || gameManager.bossEntity?.death) navigate('/end');
    }, 200);

    return () => {
      clearInterval(interval);
    };
  });

  return (
    <div style={{
      position: 'absolute',
      display: 'flex',
      flexDirection: 'row',
      width: 120,
      top: 40,
      left: 'calc(50% - 230px)',
      backgroundColor: '#0a070799',
      padding: 15,
      gap: 10,
      borderRadius: 5,
    }}>
      <div style={{
        fontSize: 12,
        display: 'flex',
        flexDirection: 'column',
        color: 'white',
      }}>
        <p>Death</p>
        <p>Count</p>
      </div>
      <div style={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 2,
      }}>
        <p style={{ color: '#dd628dff', fontSize: 25, }}>{String(deathCount).padStart(2, '0')}</p>
      </div>
    </div>
  );
};

export default DeathCountUi;
