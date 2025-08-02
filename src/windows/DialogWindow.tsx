"use client";

import React, { useState, useRef, useEffect } from 'react';
import windowManager from './WindowManager';
import { Vector } from 'matter';

const DialogWindow: React.FC = () => {
  const positionRef = useRef<Vector>({ x: 50, y: 50 });
  const [position, setPosition] = useState<Vector>(positionRef.current);
  const isDragging = useRef<boolean>(false);
  const offset = useRef<Vector>({ x: 0, y: 0 });
  const [zIndex, setZIndex] = useState<number | undefined>(undefined);
  const [showWindow, setShowWindow] = useState<boolean>(true);
  // const [currentDialog, setCurrentDialog] = useState<string>('');

  const initWinData = {
    id: 'dialog',
    posRef: positionRef,
    setPos: setPosition,
    isDragging: isDragging,
    offset: offset,
    width: 400,
    height: 250,
    showWindow: showWindow,
    setZIndex: setZIndex,
    getClickedLoc: (pos: Vector) => undefined,
  }

  useEffect(() => {
    windowManager.addWindow(initWinData);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    windowManager.makeTop('dialog');
  };

  const buttonCss = {
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 12,
    height: 20,
    color: 'white',
    textShadow: `
      -0.5px -0.5px 0 #aaa,
      0.5px -0.5px 0 #aaa,
      -0.5px 0.5px 0 #aaa,
      0.5px 0.5px 0 #aaa
    `,
  }

  return (
    <div
      style={{
        position: 'absolute',
        visibility: showWindow ? 'visible' : 'collapse',
        left: position.x,
        top: position.y,
        width: initWinData.width,
        height: initWinData.height,
        backgroundColor: '#1b9ee4',
        borderRadius: 5,
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        pointerEvents: 'auto',
        zIndex: zIndex || 0,
        cursor: 'grab',
      }}
      onMouseDown={windowManager.handleMouseDown}
    >
      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'row',
          position: 'relative',
          backgroundColor: '#eeeef0',
          borderRadius: 5,
          overflow: 'hidden',
        }}
        onMouseDown={handleMouseDown}
      >
        <div style={{
          height: '100%',
          width: 120,
          color: 'black'
        }}>
          <p>브루스</p>
        </div>
        <div style={{
          height: '100%',
          background: 'white',
          flexGrow: 2,
          display: 'flex',
          flexDirection: 'column',
          color: 'black',
          fontSize: 12,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <p style={{
            width: '70%',
            height: '70%',
            textAlign: 'left'
          }}>혹시 고고학에 대해 관심이 있나요?</p>
        </div>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        position: 'relative',
        marginTop: 5,
        gap: 3,
      }}>
        <button style={{
          ...buttonCss,
          border: '1px solid #207949',
          background: 'linear-gradient(to bottom, #c1ee21, #96ce77)',
        }}>대화 그만하기</button>
        <div style={{ flexGrow: 1 }} />
        <button style={{
          ...buttonCss,
          border: '1px solid #b4aa87',
          background: 'linear-gradient(to bottom, #ffbb44, #ffa60a)',
        }}>수락하기</button>
        <button style={{
          ...buttonCss,
          border: '1px solid #99204d',
          background: 'linear-gradient(to bottom, rgba(227, 128, 176, 1), #99204d)',
        }}>거절하기</button>
      </div>
    </div>
  );
};

export default DialogWindow;
