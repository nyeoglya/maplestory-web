"use client";

import React, { useState, useRef, useEffect } from 'react';
import DragglableItem from './DraggableItem';
import windowManager from './WindowManager';
import { Vector } from 'matter';

const InventoryWindow: React.FC = () => {
  const positionRef = useRef<Vector>({x: 50, y: 50});
  const [position, setPosition] = useState<Vector>(positionRef.current);
  const isDragging = useRef<boolean>(false);
  const offset = useRef<Vector>({ x: 0, y: 0 });
  const [zIndex, setZIndex] = useState<number | undefined>(undefined);

  const initialInventoryWindowData = {
    id: 'inventory',
    pos: position,
    posRef: positionRef,
    setPos: setPosition,
    isDragging: isDragging,
    offset: offset,
    width: 300,
    height: 600,
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
        width: 300,
        height: 600,
        backgroundColor: 'gray',
        cursor: 'grab',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        pointerEvents: 'auto',
        zIndex: zIndex || 0
      }}
      onMouseDown={windowManager.handleMouseDown}
    >
      <div style={{
        width: '100%',
        height: 25,
        display: 'flex',
        flexDirection: 'row',
      }}>
        <p style={{marginLeft: 10}}>인벤토리</p>
        <div style={{flexGrow: 1}}/>
        <button style={{
          width: 25,
          height: 25,
        }}>X</button>
      </div>
      <div style={{
        flexGrow: 1,
        backgroundColor: 'white',
      }}>
        <DragglableItem />
      </div>
    </div>
  );
};

export default InventoryWindow;
