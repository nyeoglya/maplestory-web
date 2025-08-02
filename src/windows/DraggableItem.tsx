"use client";

import { Vector } from 'matter';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import gameManager from '@/utils/manager/GameManager';
import { Item } from '@/utils/Item';
import windowManager from './WindowManager';

const DraggableItem: React.FC = () => {
  const [position, setPosition] = useState<Vector>({ x: 0, y: 0 });
  const [imgPath, setImgPath] = useState<string>('/assets/item.png');
  const [isMouseItem, setIsMouseItem] = useState<boolean>(false);
  const gridSize = 60;

  const handleMouseDown = (e: React.MouseEvent) => {
    const clickedPos = { x: e.clientX, y: e.clientY };
    const clickedWindowId = windowManager.findWindow(clickedPos);
    if (!clickedWindowId) return;
    windowManager.makeTop(clickedWindowId);
    const clickedLoc = windowManager.getWindow(clickedWindowId)?.getClickedLoc(clickedPos);
    if (clickedLoc === undefined) return;

    const moveResult = gameManager.inventoryManager.moveItem('mouse', clickedWindowId, null, clickedLoc);
    setIsMouseItem(!moveResult);
  }

  const handleMouseMove = (e: MouseEvent) => {
    setPosition({ x: e.clientX - 37.5, y: e.clientY - 37.5 });
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);

    const handleMouseItemUpdate = (newItem: Item | null) => {
      if (newItem) {
        setIsMouseItem(true);
        setImgPath(newItem.itemIconPath);
      } else {
        setIsMouseItem(false);
      }
    };

    gameManager.inventoryManager.setMouseItem = handleMouseItemUpdate;

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      gameManager.inventoryManager.setMouseItem = undefined;
    };
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        left: isMouseItem ? position.x : 0,
        top: isMouseItem ? position.y : 0,
        width: gridSize,
        height: gridSize,
        cursor: 'grab',
        userSelect: 'none',
        pointerEvents: 'auto',
        zIndex: 9999,
        visibility: isMouseItem ? 'visible' : 'collapse',
      }}
      onMouseDown={handleMouseDown}
    >
      <Image
        key={'draggableItem'}
        src={imgPath}
        alt={`draggableItem`}
        width={gridSize}
        height={gridSize}
        style={{
          objectFit: 'cover',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default DraggableItem;
