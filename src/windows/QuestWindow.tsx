"use client";

import React, { useState, useRef, useEffect } from 'react';
import windowManager from './WindowManager';
import { Vector } from 'matter';
import Quest from '@/utils/Quest';

const QuestWindow: React.FC = () => {
  const positionRef = useRef<Vector>({ x: 50, y: 50 });
  const [position, setPosition] = useState<Vector>(positionRef.current);
  const isDragging = useRef<boolean>(false);
  const offset = useRef<Vector>({ x: 0, y: 0 });
  const [zIndex, setZIndex] = useState<number | undefined>(undefined);
  const [showWindow, setShowWindow] = useState<boolean>(false);
  const [currentQuests, setCurrentQuests] = useState<Quest[]>([]);

  const initWinData = {
    id: 'inventory',
    posRef: positionRef,
    setPos: setPosition,
    isDragging: isDragging,
    offset: offset,
    width: 300,
    height: 600,
    showWindow: showWindow,
    setZIndex: setZIndex,
    getClickedLoc: (pos: Vector) => undefined,
  }

  useEffect(() => {
    windowManager.addWindow(initWinData);

    const handleQuestUpdate = (newQuests: Quest[]) => {
      setCurrentQuests(newQuests);
    };

    // gameManager.questManager.setCurrentPlayerInventory = handleQuestUpdate;
    return () => {
      // gameManager.inventoryManager.setCurrentPlayerInventory = undefined;
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    windowManager.makeTop('inventory');
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
        }}>QUESTS</p>
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
        {currentQuests.map((quest: Quest) => (
          <div key={quest.questTitle} style={{
            pointerEvents: 'auto',
          }}>
            <p>{quest.questTitle}</p>
            <p>{quest.questDescription}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestWindow;
