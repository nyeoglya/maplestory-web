"use client";

import React from 'react';
import Image from 'next/image';

interface ButtonProps {
  onClick: () => void;
  color: string;
  imgPath: string;
  altText?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, color, imgPath, altText }) => {
  return (
    <div onClick={onClick} style={{
      backgroundColor: color,
      width: 50,
      height: 50,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      cursor: 'pointer',
      flexShrink: 0,
    }}>
      <Image
        src={imgPath}
        alt={altText || '버튼 이미지'}
        width={40}
        height={40}
        style={{ objectFit: 'contain' }}
      />
    </div>
  );
};

const SettingBtnUi: React.FC = () => {
  const handleButtonClick = (buttonName: string) => {
    console.log(`${buttonName} 버튼이 클릭되었습니다!`);
  };

  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        left: '10%',
        bottom: 0,
        width: 'calc(25% - 100px)',
        height: 50,
        gap: 5,
        paddingRight: 5,
        zIndex: 102220,
      }}
    >
      <Button
        onClick={() => handleButtonClick('첫 번째')}
        color={'#f8bf01'}
        imgPath={'/vercel.svg'}
        altText={'첫 번째 설정 버튼'}
      />

      <Button
        onClick={() => handleButtonClick('두 번째')}
        color={'#39bded'}
        imgPath={'/vercel.svg'}
        altText={'두 번째 설정 버튼'}
      />
    </div>
  );
};

export default SettingBtnUi;
