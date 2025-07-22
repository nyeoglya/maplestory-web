"use client";

import React, { useState, useRef, useCallback } from 'react';

const DraggableCircle: React.FC = () => {
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [position.x, position.y]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;

    const newX = e.clientX - offset.current.x;
    const newY = e.clientY - offset.current.y;

    setPosition({ x: newX, y: newY });
  }, []);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: 100,
        height: 100,
        borderRadius: '50%',
        backgroundColor: 'red',
        cursor: 'grab',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontWeight: 'bold',
        userSelect: 'none', // 드래그 중 텍스트 선택 방지
        pointerEvents: 'auto',
      }}
      onMouseDown={handleMouseDown} // 원에 마우스 다운 이벤트 리스너 연결
    >
      드래그 미!
    </div>
  );
};

export default DraggableCircle;
