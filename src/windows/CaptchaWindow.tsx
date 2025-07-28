"use client";

import React, { useState, useRef, useEffect } from 'react';
import windowManager from './WindowManager';
import { Vector } from 'matter';

const CaptchaWindow: React.FC = () => {
  const positionRef = useRef<Vector>({x: 200, y: 50});
  const [position, setPosition] = useState<Vector>(positionRef.current);
  const isDragging = useRef<boolean>(false);
  const offset = useRef<Vector>({ x: 0, y: 0 });
  const [zIndex, setZIndex] = useState<number | undefined>(undefined);

  const onSubmitted = () => {
    
  }

  const initialInventoryWindowData = {
    id: 'captcha',
    pos: position,
    posRef: positionRef,
    setPos: setPosition,
    isDragging: isDragging,
    offset: offset,
    width: 300,
    height: 300,
    setZIndex: setZIndex,
  }

  useEffect(() => {
    windowManager.addWindow(initialInventoryWindowData);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: initialInventoryWindowData.width,
        height: initialInventoryWindowData.height,
        backgroundColor: 'gray',
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
        }}
        onMouseDown={windowManager.handleMouseDown}
      >
        <p style={{marginLeft: 10}}>거짓말탐지기</p>
        <div style={{flexGrow: 1}}/>
      </div>
      <div style={{
        flexGrow: 1,
        backgroundColor: 'white',
        color: 'black',
      }}>
        <p>아래 내용을 정확하게 입력하세요: </p>
        <p>산치핀치산치핀치산치핀치산치핀치</p>
        <input type="text" />
        <button onClick={onSubmitted}>
          <p>제출하기</p>
        </button>
      </div>
    </div>
  );
};

export default CaptchaWindow;
