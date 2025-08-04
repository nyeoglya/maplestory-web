"use client";

import React, { useState, useRef, useEffect } from 'react';
import windowManager from './WindowManager';
import { Vector } from 'matter';

const BossEnterWindow: React.FC = () => {
  const positionRef = useRef<Vector>({ x: 200, y: 50 });
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
    height: 500,
    showWindow: showWindow,
    setZIndex: setZIndex,
    getClickedLoc: (pos: Vector) => undefined,
  }

  useEffect(() => {
    windowManager.addWindow(initWinData);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    windowManager.makeTop('bossEnter');
  };

  const gridSize = 60;

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
          textAlign: 'center'
        }}>EQUIPMENT INVENTORY</p>
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
        }}
        onMouseDown={handleMouseDown}
      >
      </div>
    </div>
  );
};

export default BossEnterWindow;
