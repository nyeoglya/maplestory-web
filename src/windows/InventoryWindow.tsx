"use client";

import React, { useState, useRef, useEffect } from 'react';
import windowManager from './WindowManager';
import { Vector } from 'matter';
import gameManager from '@/utils/manager/GameManager';
import Image from 'next/image';
import { Item } from '@/utils/Item';
// import keyboardManager from '@/utils/manager/KeyManager';

const InventoryWindow: React.FC = () => {
  const positionRef = useRef<Vector>({ x: 50, y: 50 });
  const [position, setPosition] = useState<Vector>(positionRef.current);
  const isDragging = useRef<boolean>(false);
  const offset = useRef<Vector>({ x: 0, y: 0 });
  const [zIndex, setZIndex] = useState<number | undefined>(undefined);
  const [showWindow, setShowWindow] = useState<boolean>(true);
  const [currentPlayerInventory, setCurrentPlayerInventory] = useState<Item[]>(gameManager.inventoryManager.currentPlayerInventory);
  const gridSize = 75;

  const initWinData = {
    id: 'inventory',
    pos: position,
    posRef: positionRef,
    setPos: setPosition,
    isDragging: isDragging,
    offset: offset,
    width: gridSize * 4,
    height: gridSize * 8,
    showWindow: showWindow,
    setZIndex: setZIndex,
  }

  useEffect(() => {
    windowManager.addWindow(initWinData);

    const handleInventoryUpdate = (newInventory: Item[]) => {
      setCurrentPlayerInventory([...newInventory]);
    };

    gameManager.inventoryManager.setCurrentPlayerInventory = handleInventoryUpdate;

    /*
    const handleIKeyPress = (event: KeyboardEvent) => {
      console.log("i 키가 감지되었습니다! (YourComponent)");
      // event.preventDefault();
    };
    keyboardManager.onKeyDown('i', handleIKeyPress);
    */
    return () => {
      gameManager.inventoryManager.setCurrentPlayerInventory = undefined;
      // keyboardManager.offKeyDown('i', handleIKeyPress);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    windowManager.makeTop('inventory');
    const relativeX = e.clientX - positionRef.current.x;
    const relativeY = e.clientY - positionRef.current.y;
    const itemIndex = Math.floor(relativeX / gridSize) + 4 * Math.floor(relativeY / gridSize);
    gameManager.inventoryManager.moveItem('inventory', 'mouse', itemIndex);
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
        <p style={{ marginLeft: 10 }}>인벤토리(제작중)</p>
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
          position: 'relative',
          backgroundColor: 'white',
          overflow: 'hidden',
        }}
        onMouseDown={handleMouseDown}
      >
        {currentPlayerInventory.map((item, index) => (
          <Image
            key={item.uuid}
            src={item.itemIconPath}
            alt={`Item ${item.name}`}
            width={gridSize}
            height={gridSize}
            style={{
              objectFit: 'cover',
              position: 'absolute',
              left: `${(index % 4) * gridSize}px`,
              top: `${Math.floor(index / 4) * gridSize}px`,
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default InventoryWindow;
