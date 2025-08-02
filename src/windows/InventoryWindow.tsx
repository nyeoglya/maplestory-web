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
  const [showWindow, setShowWindow] = useState<boolean>(false);
  const [currentPlayerInventory, setCurrentPlayerInventory] = useState<Map<number, Item | null>>(gameManager.inventoryManager.currentPlayerInventoryMap);
  const gridSize = 60;

  const getClickedLoc = (pos: Vector) => {
    const relativeX = pos.x - positionRef.current.x - 5;
    const relativeY = pos.y - positionRef.current.y - 25;
    if (relativeX < 0 || relativeY < 0) return undefined;
    return Math.floor(relativeX / gridSize) + 4 * Math.floor(relativeY / gridSize);
  };

  const initWinData = {
    id: 'inventory',
    posRef: positionRef,
    setPos: setPosition,
    isDragging: isDragging,
    offset: offset,
    width: gridSize * 4 + 10,
    height: gridSize * 8 + 25,
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
    const clickedLoc = getClickedLoc({ x: e.clientX, y: e.clientY }) ?? null;
    gameManager.inventoryManager.moveItem('inventory', 'mouse', clickedLoc, null);
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
        }}>ITEM INVENTORY</p>
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
          position: 'relative',
          backgroundColor: 'white',
          borderRadius: 5,
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
            border: '2px solid #f4f7f8',
            borderRadius: 5,
            background: 'linear-gradient(0deg, white 0%, white 80%, #cbcbcb 100%)',
            left: `${(key % 4) * gridSize}px`,
            top: `${Math.floor(key / 4) * gridSize}px`,
          }}>
            {item &&
              <>
                <div style={{
                  position: 'absolute',
                  top: 50,
                  left: 13,
                  width: 30,
                  height: 5,
                  background: 'radial-gradient(ellipse at center, #989a99 0%, rgba(0,0,0,0) 100%)',
                  borderRadius: '50%',
                }} />
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
              </>
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryWindow;
