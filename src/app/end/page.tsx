"use client";

import gameManager from '@/utils/manager/GameManager';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const GameEndUi: React.FC = () => {

  const [win, setWin] = useState<boolean>(false);
  const router = useRouter();

  const resetGame = () => {
    gameManager.deathCount = 5;
    router.back();
  }

  useEffect(() => {
    if (gameManager.deathCount <= 0) setWin(false);
    else setWin(true);
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <p>게임이 끝났다. 결과: </p>
      {win &&
        <p>승리</p>
      }
      {!win &&
        <p>패배</p>
      }
      <p>다시 플레이하려면 아래 버튼을 클릭해주세요.</p>
      <button onClick={resetGame}>
        <p>초기화</p>
      </button>
    </div>
  );
};

export default GameEndUi;
