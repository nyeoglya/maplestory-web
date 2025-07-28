"use client";

import gameManager from '@/utils/manager/GameManager';
import React, { useEffect, useState } from 'react';

const MesoCountUi: React.FC = () => {
  const [mesoCount, setMesoCount] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const mesoCount = gameManager.phaserPlayer?.mesoCount;
      if (mesoCount) setMesoCount(mesoCount);
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
      left: 'calc(50% + 140px)',
      backgroundColor: '#0a070799',
      padding: 15,
      gap: 5,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
    }}>
      <p style={{ fontSize: 18, }}>메소</p>
      <div style={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}>
        <p style={{ color: '#62dd66ff', fontSize: 25 }}>{mesoCount}</p>
      </div>
    </div>
  );
};

export default MesoCountUi;
