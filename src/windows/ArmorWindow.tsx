"use client";

import React, { useState, useRef, useEffect } from 'react';
import windowManager from './WindowManager';
import { Vector } from 'matter';
import { Item } from '@/utils/Item';
import gameManager from '@/utils/manager/GameManager';
import Image from 'next/image';

const ArmorWindow: React.FC = () => {
  const positionRef = useRef<Vector>({ x: 200, y: 50 });
  const [position, setPosition] = useState<Vector>(positionRef.current);
  const isDragging = useRef<boolean>(false);
  const offset = useRef<Vector>({ x: 0, y: 0 });
  const [showWindow, setShowWindow] = useState<boolean>(true);
  const [zIndex, setZIndex] = useState<number | undefined>(undefined);
  const [currentArmorInventory, setCurrentArmorInventory] = useState<Map<string, { pos: Vector, item: Item | null }>>(gameManager.inventoryManager.currentArmorInventoryMap);

  const getClickedLoc = (pos: Vector) => {
    const allElements = document.elementsFromPoint(pos.x, pos.y);
    const armorWindow = document.getElementById('armorWindowInner');
    if (!allElements || !armorWindow) return undefined;
    const clickedInsideArmor = allElements.find(el => armorWindow.contains(el));
    return clickedInsideArmor?.id;
  };

  const initWinData = {
    id: 'armor',
    posRef: positionRef,
    setPos: setPosition,
    isDragging: isDragging,
    offset: offset,
    width: 500,
    height: 500,
    showWindow: showWindow,
    setZIndex: setZIndex,
    getClickedLoc: getClickedLoc,
  }

  useEffect(() => {
    windowManager.addWindow(initWinData);

    const handleInventoryUpdate = (newInventory: Map<string, { pos: Vector, item: Item | null }>) => {
      setCurrentArmorInventory(new Map(newInventory));
    };

    gameManager.inventoryManager.setCurrentArmorInventory = handleInventoryUpdate;

  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    windowManager.makeTop('armor');
    const loc = getClickedLoc({ x: e.clientX, y: e.clientY });
    if (!loc) return;
    gameManager.inventoryManager.moveItem('armor', 'mouse', loc, null);
  };

  const gridSize = 75;

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
      <div id='armorWindowInner'
        style={{
          flexGrow: 1,
          backgroundColor: 'white',
        }}
        onMouseDown={handleMouseDown}
      >
        {Array.from(currentArmorInventory.entries()).map(([key, value]: [string, { pos: Vector, item: Item | null }]) =>
          <div key={key} id={key} style={{
            position: 'absolute',
            left: value.pos.x,
            top: value.pos.y,
            backgroundColor: 'lightblue',
            pointerEvents: 'auto',
            width: 75,
            height: 75,
          }}>
            {value.item &&
              <Image
                src={value.item.itemIconPath}
                alt={`Item ${value.item.name}`}
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
        )}
      </div>
    </div>
  );
};

export default ArmorWindow;
