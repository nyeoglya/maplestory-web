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
  const [showWindow, setShowWindow] = useState<boolean>(false);
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

  const gridSize = 60;

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
        }}>EQUIPMENT INVENTORY</p>
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
      <div id='armorWindowInner'
        style={{
          flexGrow: 1,
          backgroundColor: 'white',
          borderRadius: 5,
        }}
        onMouseDown={handleMouseDown}
      >
        {Array.from(currentArmorInventory.entries()).map(([key, value]: [string, { pos: Vector, item: Item | null }]) =>
          <div key={key} id={key} style={{
            position: 'absolute',
            left: value.pos.x,
            top: value.pos.y,
            background: 'linear-gradient(to top, rgba(117,133,149,255) 0%, rgba(109,116,124,255) 100%)',
            border: '1px solid #39463f',
            borderRadius: 5,
            pointerEvents: 'auto',
            width: gridSize,
            height: gridSize,
            padding: 2,
          }}>
            {value.item &&
              <>
                <div style={{
                  position: 'absolute',
                  top: 49,
                  left: 14,
                  width: 30,
                  height: 5,
                  background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
                  borderRadius: '50%',
                }} />
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
              </>
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default ArmorWindow;
