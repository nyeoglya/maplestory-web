"use client";

import { Vector } from 'matter';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import windowManager from './WindowManager';

const DragglableItem: React.FC = () => {
  const positionRef = useRef<Vector>({x: 0, y: 20});
  const [position, setPosition] = useState<Vector>(positionRef.current);
  const isDragging = useRef<boolean>(false);
  const offset = useRef<Vector>({ x: 0, y: 0 });
  const [zIndex, setZIndex] = useState<number | undefined>(undefined);

  const initialItemData = {
    id: 'item',
    pos: position,
    posRef: positionRef,
    setPos: setPosition,
    isDragging: isDragging,
    offset: offset,
    width: 75,
    height: 75,
    setZIndex: setZIndex,
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: 75,
        height: 75,
        backgroundColor: 'blue',
        cursor: 'grab',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        pointerEvents: 'auto',
      }}
      onMouseDown={windowManager.handleMouseDown}
    ></div>
  );
};

export default DragglableItem;
