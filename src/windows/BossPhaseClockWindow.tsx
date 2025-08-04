"use client";

import React, { useState, useRef, useEffect } from 'react';
import windowManager from './WindowManager';
import { Vector } from 'matter';
import gameManager from '@/utils/manager/GameManager';

const BossPhaseClockWindow: React.FC = () => {
  const positionRef = useRef<Vector>({ x: 100, y: 100 });
  const [position, setPosition] = useState<Vector>(positionRef.current);
  const isDragging = useRef<boolean>(false);
  const offset = useRef<Vector>({ x: 0, y: 0 });
  const [zIndex, setZIndex] = useState<number | undefined>(undefined);
  const [showWindow, setShowWindow] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const boss = gameManager.bossEntity;
      if (!boss || !boss.scene) {
        setShowWindow((prev) => {
          if (prev) return false;
          return prev;
        });
        return;
      }

      setShowWindow((prev) => {
        if (!prev) return true;
        return prev;
      });

      setRotation(Math.ceil((150 - boss.bossTimeLeft % 150) * 12 / 5));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const initWinData = {
    id: 'bossPhaseClock',
    posRef: positionRef,
    setPos: setPosition,
    isDragging: isDragging,
    offset: offset,
    width: 200,
    height: 200,
    showWindow: showWindow,
    setZIndex: setZIndex,
    getClickedLoc: (pos: Vector) => undefined,
  };
  const radius = initWinData.width / 2;

  useEffect(() => {
    windowManager.addWindow(initWinData);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        visibility: showWindow ? 'visible' : 'collapse',
        left: position.x,
        top: position.y,
        width: initWinData.width,
        height: initWinData.height,
        borderRadius: '50%',
        userSelect: 'none',
        cursor: 'grab',
        pointerEvents: 'auto',
        border: '4px solid #1d4869',
        boxSizing: 'border-box',
        zIndex,
        overflow: 'hidden',
        backgroundColor: '#e0e0e0',
        boxShadow: '0 0 10px rgba(0,0,0,0.4)',
      }}
      onMouseDown={windowManager.handleMouseDown}
    >
      <svg width="100%" height="100%" viewBox="0 0 200 200">
        {/* 시계 배경 */}
        <circle cx="100" cy="100" r="98" fill="url(#clockGradient)" stroke="#1d4869" strokeWidth="2" />

        {/* 시계 그라디언트 정의 */}
        <defs>
          <radialGradient id="clockGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#cccccc" />
          </radialGradient>
        </defs>

        {/* 눈금 표시 */}
        {[...Array(60)].map((_, i) => {
          const angle = (i * 6 - 90) * (Math.PI / 180);
          const inner = i % 5 === 0 ? 85 : 92;
          const outer = 98;
          const x1 = (100 + inner * Math.cos(angle)).toFixed(4);
          const y1 = (100 + inner * Math.sin(angle)).toFixed(4);
          const x2 = (100 + outer * Math.cos(angle)).toFixed(4);
          const y2 = (100 + outer * Math.sin(angle)).toFixed(4);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#333"
              strokeWidth={i % 5 === 0 ? 2 : 1}
            />
          );
        })}

        {/* 원형 섹션 (페이즈 구분용) */}
        {[...Array(5)].map((_, i) => {
          const cx = 100;
          const cy = 100;
          const r = 100;

          const startAngle = (i * 72 - 90) * (Math.PI / 180);
          const endAngle = ((i + 1) * 72 - 90) * (Math.PI / 180);

          const x1 = (cx + r * Math.cos(startAngle)).toFixed(4);
          const y1 = (cy + r * Math.sin(startAngle)).toFixed(4);
          const x2 = (cx + r * Math.cos(endAngle)).toFixed(4);
          const y2 = (cy + r * Math.sin(endAngle)).toFixed(4);

          const colors = ['#ffffff', '#ffffff', '#eeeeee', '#eeeeee', '#aaaaaa'];

          return (
            <path
              key={i}
              d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`}
              fill={colors[i]}
              fillOpacity={0.1}
            />
          );
        })}
      </svg>

      {/* 시계 바늘 */}
      <div
        style={{
          position: 'absolute',
          top: radius,
          left: radius,
          width: 4,
          height: radius - 25,
          borderRadius: radius / 2,
          backgroundColor: '#1d4869',
          transform: `translate(-50%, -100%) rotate(${rotation}deg)`,
          transformOrigin: 'bottom center',
        }}
      />

      {/* 중심 축 */}
      <div
        style={{
          position: 'absolute',
          top: radius - 5,
          left: radius - 5,
          width: 10,
          height: 10,
          backgroundColor: '#1d4869',
          borderRadius: '50%',
          border: '2px solid #ffffff',
        }}
      />
    </div>
  );
};

export default BossPhaseClockWindow;
