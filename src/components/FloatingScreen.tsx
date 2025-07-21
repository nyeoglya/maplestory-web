"use client";

import React, { useState, useRef, useEffect } from 'react'; // useEffect를 임포트합니다.
import Draggable, { DraggableData } from 'react-draggable';

function clamp(x: number, min: number, max: number) {
  return Math.min(Math.max(x, min), max);
}

function FloatingScreen() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const nodeRef = useRef(null);

  const floatingScreenWidth = 300;
  const floatingScreenHeight = 400;

  // 뷰포트 크기를 저장할 상태를 만듭니다.
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function updateViewportSize() {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    updateViewportSize();

    window.addEventListener('resize', updateViewportSize);
    return () => window.removeEventListener('resize', updateViewportSize);
  }, []);

  const handleOnDrag = (data: DraggableData) => {
    setPosition({
      x: clamp(data.x, 0, viewport.width - floatingScreenWidth),
      y: clamp(data.y, 0, viewport.height - floatingScreenHeight),
    });
  };

  return (
    <div style={{ position: 'absolute', pointerEvents: 'auto', width: 0, height: 0, zIndex: 999 }}>
      <Draggable
        position={{ x: position.x, y: position.y }}
        onDrag={(_, data) => handleOnDrag(data)}
        nodeRef={nodeRef}
        handle=".drag-handle"
      >
        <div
          ref={nodeRef}
          style={{
            width: floatingScreenWidth,
            height: floatingScreenHeight,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        }}>
          <div
            className="drag-handle"
            style={{
              width: '100%',
              cursor: 'grab',
              backgroundColor: 'purple',
          }}>
            <p>헤더</p>
          </div>
          <div
            style={{
              flexGrow: 1,
              backgroundColor: 'blue',
            }}
          >
            <p>내용</p>
          </div>
        </div>
      </Draggable>
    </div>
  );
}

export default FloatingScreen;
