"use client";

import React, { useState, useRef, useEffect } from 'react';
import windowManager from './WindowManager';
import { Vector } from 'matter';
import gameManager from '@/utils/manager/GameManager';

const BossPhaseClockWindow: React.FC = () => {
  const positionRef = useRef<Vector>({ x: 200, y: 50 });
  const [position, setPosition] = useState<Vector>(positionRef.current);
  const isDragging = useRef<boolean>(false);
  const offset = useRef<Vector>({ x: 0, y: 0 });
  const [zIndex, setZIndex] = useState<number | undefined>(undefined);
  const [showWindow, setShowWindow] = useState<boolean>(true);
  const [rotation, setRotation] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const boss = gameManager.bossEntity;
      if (!boss) return;
      setRotation(Math.ceil((150 - boss.bossTimeLeft % 150) * 12 / 5))
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const initWinData = {
    id: 'bossPhaseClock',
    pos: position,
    posRef: positionRef,
    setPos: setPosition,
    isDragging: isDragging,
    offset: offset,
    width: 200,
    height: 200,
    showWindow: showWindow,
    setZIndex: setZIndex,
  }
  const radius = initWinData.width / 2;

  useEffect(() => {
    windowManager.addWindow(initWinData);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: initWinData.width,
        height: initWinData.height,
        borderRadius: '50%',
        userSelect: 'none',
        cursor: 'grab',
        pointerEvents: 'auto',
        border: '2px solid #1d4869',
        boxSizing: 'border-box',
        zIndex,
        overflow: 'hidden',
      }}
      onMouseDown={windowManager.handleMouseDown}
    >
      <svg width="100%" height="100%" viewBox="0 0 200 200" style={{ position: 'absolute', top: 0, left: 0 }}>
        {[...Array(5)].map((_, i) => {
          const cx = 100;
          const cy = 100;
          const r = 100;

          const startAngle = (i * 72 - 90) * (Math.PI / 180);
          const endAngle = ((i + 1) * 72 - 90) * (Math.PI / 180);

          const x1 = cx + r * Math.cos(startAngle);
          const y1 = cy + r * Math.sin(startAngle);
          const x2 = cx + r * Math.cos(endAngle);
          const y2 = cy + r * Math.sin(endAngle);

          const colors = ['#ffffff', '#ffffff', '#eeeeee', '#eeeeee', '#aaaaaa'];

          return (
            <path
              key={i}
              d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`}
              fill={colors[i]}
              fillOpacity={0.8}
            />
          );
        })}
      </svg>

      <div
        style={{
          position: 'absolute',
          top: radius,
          left: radius,
          width: 4,
          height: radius - 20,
          borderRadius: radius / 2,
          backgroundColor: '#1d4869',
          transform: `translate(-50%, -100%) rotate(${rotation}deg)`,
          transformOrigin: 'bottom center',
        }}
      />
    </div>
  );
};

export default BossPhaseClockWindow;
