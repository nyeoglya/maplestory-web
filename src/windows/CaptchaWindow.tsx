"use client";

import React, { useState, useRef, useEffect } from 'react';
import windowManager from './WindowManager';
import { Vector } from 'matter';
import gameManager from '@/utils/manager/GameManager';
import emitter from '@/utils/EventBus';
import { DebuffCaptcha } from '@/utils/Effect';

const CaptchaWindow: React.FC = () => {
  const positionRef = useRef<Vector>({ x: 200, y: 50 });
  const [position, setPosition] = useState<Vector>(positionRef.current);
  const isDragging = useRef<boolean>(false);
  const offset = useRef<Vector>({ x: 0, y: 0 });
  const [zIndex, setZIndex] = useState<number | undefined>(undefined);
  const [showWindow, setShowWindow] = useState<boolean>(false);
  const [text, setText] = useState<string>('텍스트');
  const [inputText, setInputText] = useState<string>('');

  const onSubmitted = () => {
    gameManager.player.isMove = true;
    if (text == inputText) {
      setShowWindow(false);
    } else {
      gameManager.effectManager.addEffect(DebuffCaptcha);
    }
  }

  const renewText = () => {
    setText('산치핀치');
    setInputText('');
  }

  const initWinData = {
    id: 'captcha',
    pos: position,
    posRef: positionRef,
    setPos: setPosition,
    isDragging: isDragging,
    offset: offset,
    width: 300,
    height: 250,
    showWindow: showWindow,
    setZIndex: setZIndex,
  }

  useEffect(() => {
    windowManager.addWindow(initWinData);

    const handler = () => {
      gameManager.player.isMove = false;
      windowManager.setWindowPosition(initWinData.id, initWinData.pos);
      windowManager.makeTop(initWinData.id);
      setShowWindow(true);
      renewText();
    };

    emitter.on('captcha', handler);

    return () => {
      emitter.off('captcha', handler);
    };
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        visibility: showWindow ? 'visible' : 'collapse',
        left: position.x,
        top: position.y,
        width: initWinData.width,
        height: initWinData.height,
        backgroundColor: '#ffffff77',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        userSelect: 'none',
        pointerEvents: 'auto',
        zIndex: zIndex || 0,
        padding: 10,
        borderRadius: 10,
        border: '2px solid #474747ff',
      }}
      onMouseDown={windowManager.handleMouseDown}
    >
      <div style={{
        backgroundColor: '#50a1cf',
        color: 'white',
        padding: 15,
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
        border: '2px solid #d3d3d3ff',
      }}>
        <p style={{ width: 140, textAlign: 'center' }}>아래의 한글을 보이는 대로 입력하세요.</p>
        <p style={{
          backgroundColor: 'white',
          color: 'black',
          width: '100%',
          textAlign: 'center',
          fontSize: 40
        }}>{text}</p>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{
            width: '100%',
            fontSize: 25,
            backgroundColor: 'white',
            color: 'black',
            borderRadius: 5,
          }}
        />
      </div>
      <div style={{
        marginTop: 10,
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        gap: 5,
      }}>
        <div style={{ flexGrow: 1, }} />
        <button style={{ borderWidth: 0, backgroundColor: '#ffffff00' }} onClick={renewText}>
          <p style={{
            backgroundColor: '#bf4a6d',
            width: 60,
            color: 'white',
            borderRadius: 5,
            borderWidth: 0,
          }}>새로고침</p>
        </button>
        <button style={{ borderWidth: 0, backgroundColor: '#ffffff00' }} onClick={onSubmitted}>
          <p style={{
            backgroundColor: '#93c152',
            width: 40,
            color: 'white',
            borderRadius: 5,
            borderWidth: 0,
          }}>확인</p>
        </button>
      </div>
    </div>
  );
};

export default CaptchaWindow;
