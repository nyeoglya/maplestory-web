"use client";

import gameManager from '@/utils/manager/GameManager';
import React, { useEffect, useRef, useState } from 'react';

const VideoUi: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleVideoPlay = () => {
      setVisible(true);
      setTimeout(() => {
        setIsPlaying(true);
        videoRef.current?.play();
      }, 100);
    };

    gameManager.toggleVideoPlay = handleVideoPlay;

    return () => {
      gameManager.toggleVideoPlay = undefined;
    };
  }, []);

  const handleVideoEnd = () => {
    setIsPlaying(false);
    gameManager.moveScene = { sceneName: 'BossScene', fadeOutTime: 0 };
    setTimeout(() => {
      setVisible(false);
    }, 1000);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'absolute',
      opacity: isPlaying ? 1 : 0,
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'black',
      transition: 'opacity 1s ease-in-out',
      pointerEvents: 'none',
    }}>
      <video
        ref={videoRef}
        src="/assets/bossintro.mp4"
        playsInline
        onEnded={handleVideoEnd}
        style={{
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
        }}
      />
    </div>
  );
};

export default VideoUi;
