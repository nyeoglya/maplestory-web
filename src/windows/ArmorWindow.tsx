"use client";

import React, { useState, useRef, useEffect } from 'react';
import windowManager from './WindowManager';
import { Vector } from 'matter';

const ArmorWindow: React.FC = () => {
  const positionRef = useRef<Vector>({ x: 200, y: 50 });
  const [position, setPosition] = useState<Vector>(positionRef.current);
  const isDragging = useRef<boolean>(false);
  const offset = useRef<Vector>({ x: 0, y: 0 });
  const [showWindow, setShowWindow] = useState<boolean>(true);
  const [zIndex, setZIndex] = useState<number | undefined>(undefined);

  const initWinData = {
    id: 'armor',
    pos: position,
    posRef: positionRef,
    setPos: setPosition,
    isDragging: isDragging,
    offset: offset,
    width: 500,
    height: 500,
    showWindow: showWindow,
    setZIndex: setZIndex,
  }

  useEffect(() => {
    windowManager.addWindow(initWinData);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    windowManager.makeTop('armor');
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
        <p style={{ marginLeft: 10 }}>장비창(제작중)</p>
        <div style={{ flexGrow: 1 }} />
        <button
          onClick={() => setShowWindow(false)}
          style={{
            width: 25,
            height: 25,
          }}>X</button>
      </div>
      <div
        style={{
          flexGrow: 1,
          backgroundColor: 'white',
        }}
        onMouseDown={handleMouseDown}
      >
        <div style={{
          backgroundColor: 'blue',
          width: 75,
          height: 75,
        }}>

        </div>
      </div>
    </div>
  );
};

export default ArmorWindow;
