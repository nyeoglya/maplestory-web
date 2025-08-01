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
  const [currentPlayerInventory, setCurrentPlayerInventory] = useState<Map<number, Item | null>>(gameManager.inventoryManager.currentPlayerInventoryMap);
  const gridSize = 75;

  const getClickedLoc = (pos: Vector) => {
    const relativeX = pos.x - positionRef.current.x;
    const relativeY = pos.y - positionRef.current.y - 25;
    return Math.floor(relativeX / gridSize) + 4 * Math.floor(relativeY / gridSize);
  };

  const initWinData = {
    id: 'inventory',
    posRef: positionRef,
    setPos: setPosition,
    isDragging: isDragging,
    offset: offset,
    width: gridSize * 4,
    height: gridSize * 8,
    showWindow: showWindow,
    setZIndex: setZIndex,
    getClickedLoc: getClickedLoc,
  }

  useEffect(() => {
    windowManager.addWindow(initWinData);

    const handleInventoryUpdate = (newInventory: Map<number, Item | null>) => {
      setCurrentPlayerInventory(new Map(newInventory));
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
    gameManager.inventoryManager.moveItem('inventory', 'mouse', getClickedLoc({ x: e.clientX, y: e.clientY }), null);
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
        {Array.from(currentPlayerInventory.entries()).map(([key, item]: [number, Item | null]) => (
          <div key={key} style={{
            width: gridSize,
            height: gridSize,
            pointerEvents: 'auto',
            zIndex: 0,
            position: 'absolute',
            border: '2px solid black',
            background: 'white',
            left: `${(key % 4) * gridSize}px`,
            top: `${Math.floor(key / 4) * gridSize}px`,
          }}>
            {item &&
              <Image
                src={item.itemIconPath}
                alt={`Item ${item.name}`}
                width={gridSize - 4}
                height={gridSize - 4}
                style={{
                  objectFit: 'cover',
                  position: 'absolute',
                  pointerEvents: 'none',
                }}
              />
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryWindow;
