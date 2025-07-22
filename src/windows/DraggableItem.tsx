"use client";

import { Vector } from 'matter';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import gameManager from '@/utils/GameManager';

const DraggableItem: React.FC = () => {
  const [position, setPosition] = useState<Vector>({x: 0, y: 0});
  const [imgPath, setImgPath] = useState<string>('/assets/item.png');
  const [isMouseItem, setIsMouseItem] = useState<boolean>(false);
  const gridSize = 75;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsMouseItem(false);
  }

  const handleMouseMove = (e: MouseEvent) => {
    setPosition({x: e.clientX - 37.5, y: e.clientY - 37.5});
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (gameManager.inventoryManager.mouseItem) {
      setIsMouseItem(true);
      setImgPath(gameManager.inventoryManager.mouseItem.itemIconPath);
    }
  }, [gameManager.inventoryManager.mouseItem]);

  return (
    <div
      style={{
        position: 'absolute',
        left: isMouseItem ? position.x : 0,
        top: isMouseItem ? position.y : 0,
        width: gridSize,
        height: gridSize,
        backgroundColor: 'blue',
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
