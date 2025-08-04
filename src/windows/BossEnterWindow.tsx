"use client";

import React, { useState, useRef, useEffect } from 'react';
import windowManager from './WindowManager';
import { Vector } from 'matter';
import gameManager from '@/utils/manager/GameManager';

const BossEnterWindow: React.FC = () => {
  const positionRef = useRef<Vector>({ x: 200, y: 200 });
  const [position, setPosition] = useState<Vector>(positionRef.current);
  const isDragging = useRef<boolean>(false);
  const offset = useRef<Vector>({ x: 0, y: 0 });
  const [showWindow, setShowWindow] = useState<boolean>(false);
  const [zIndex, setZIndex] = useState<number | undefined>(undefined);

  const initWinData = {
    id: 'bossEnter',
    posRef: positionRef,
    setPos: setPosition,
    isDragging: isDragging,
    offset: offset,
    width: 500,
    height: 400,
    showWindow: showWindow,
    setZIndex: setZIndex,
    getClickedLoc: (pos: Vector) => undefined,
  }

  useEffect(() => {
    windowManager.addWindow(initWinData);

    const toggleShowWindow = (value: boolean) => {
      setShowWindow(value);
      windowManager.makeTop('bossEnter');
    };

    gameManager.toggleBossWindow = toggleShowWindow;

    return () => {
      gameManager.toggleBossWindow = undefined;
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    windowManager.makeTop('bossEnter');
  };

  const clickBossEnter = () => {
    if (!gameManager.toggleVideoPlay) return;
    setShowWindow(false);
    gameManager.backgroundBGM?.stop();
    gameManager.toggleVideoPlay(true);
  };

  return (
    <div
      style={{
        position: 'absolute',
        visibility: showWindow ? 'visible' : 'collapse',
        left: position.x,
        top: position.y,
        width: initWinData.width,
        height: initWinData.height,
        backgroundColor: 'rgba(0,0,0,0)',
        border: '5px solid rgba(19,34,8,255)',
        boxSizing: 'border-box',
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        pointerEvents: 'auto',
        zIndex: zIndex || 0
      }}
    >
      <div
        style={{
          width: '100%',
          height: 25,
          display: 'flex',
          cursor: 'grab',
          flexDirection: 'row',
          backgroundColor: 'rgba(19,34,8,255)',
          alignItems: 'center',
        }}
        onMouseDown={windowManager.handleMouseDown}
      >
        <p style={{
          fontSize: 12,
          color: '#f3f029ff',
          width: '100%',
          paddingLeft: 10,
          textAlign: 'left'
        }}>BOSS ENTRY</p>
        <div style={{ flexGrow: 1 }} />
        <button
          onClick={() => setShowWindow(false)}
          style={{
            width: 25,
            height: 25,
            color: 'white',
            border: '0px solid black',
            backgroundColor: '#00000000'
          }}>X</button>
      </div>
      <div
        style={{
          flexGrow: 1,
          backgroundColor: 'white',
          borderRadius: 5,
          backgroundImage: 'url("/assets/bossEnterBackground.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseDown={handleMouseDown}
      >
        <p
          style={{
            position: 'absolute',
            right: 20,
            top: 20,
            fontSize: 25,
            color: 'white',
          }}
        >디렉터 강원기</p>
        <div style={{
          position: 'absolute',
          right: 20,
          top: 150,
          fontSize: 15,
          width: 120,
          height: 30,
          background: 'linear-gradient(to bottom, #1a181c, #333135)',
          border: '1px solid #6b6b6b',
          borderRadius: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <p
            style={{
              color: 'white',
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >STORY</p>
        </div>
        <button
          onClick={clickBossEnter}
          style={{
            position: 'absolute',
            right: 20,
            bottom: 20,
            width: 120,
            height: 40,
            fontSize: 18,
            background: 'linear-gradient(to top, #273442, #476b89)',
            border: '0px solid black',
            borderRadius: 5,
            fontWeight: 'bold',
          }}>
          입장하기
        </button>
      </div>

    </div>
  );
};

export default BossEnterWindow;
