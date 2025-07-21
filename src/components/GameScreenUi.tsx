"use client";

import React, {useState} from 'react';

import FloatingScreen from './FloatingScreen';

const GameScreenUi: React.FC = () => {

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 999,
      pointerEvents: 'none',
    }}>
      {/* <FloatingScreen /> */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: 10,
        top: 0,
        left: 0,
      }}>
        <div style={{
          position: 'absolute',
          left: 'calc(25% - 40px)',
          width: 40,
          height: 40,
          backgroundColor: 'red'
        }}></div>
        <div style={{
          position: 'absolute',
          left: '25%',
          width: '50%',
          height: 15,
          backgroundColor: 'gray'
        }}></div>
        <div style={{
          position: 'absolute',
          left: '25%',
          width: '10%',
          height: 15,
          backgroundColor: 'white'
        }}></div>
        <div style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          width: 200,
          top: 40,
          left: 'calc(50% - 100px)',
          backgroundColor: 'green',
          alignItems: 'center',
        }}>
          <p>남은 시간</p>
          <p>30분 00초</p>
        </div>
        <div style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'row',
          right: 0,
          backgroundColor: 'purple',
          width: '25%',
          height: 200
        }}>
          <div style={{
            position: 'absolute',
            right: 0,
            backgroundColor: 'yellow',
            width: 50,
            height: 50
          }}></div>
        </div>
      </div>
      <div style={{
        position: 'absolute',
        width: '100%',
        bottom: 0,
        left: 0,
        height: 10,
      }}>
        <div style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          width: 200,
          bottom: 10,
          left: 'calc(50% - 100px)',
          backgroundColor: 'green',
          alignItems: 'center',
        }}>
          <p>레벨/이름</p>
          <p>체력: ???</p>
          <p>마나: ???</p>
        </div>
        <div style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'row',
          left: '10%',
          bottom: 0,
          backgroundColor: 'orange',
          width: 'calc(25% - 100px)',
          height: 50
        }}>
          <div style={{
            position: 'absolute',
            right: 0,
            backgroundColor: 'lightblue',
            width: 50,
            height: 50
          }}></div>
        </div>
        <div style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'row',
          right: 0,
          bottom: 0,
          backgroundColor: 'purple',
          width: '25%',
          height: 80
        }}>
          <div style={{
            position: 'absolute',
            right: 0,
            backgroundColor: 'yellow',
            width: 40,
            height: 40
          }}></div>
        </div>
      </div>
    </div>
  );
};

export default GameScreenUi;
