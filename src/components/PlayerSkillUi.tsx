"use client";

import React, { useEffect, useState } from 'react';
import gameManager from '@/utils/GameManager';
import Image from 'next/image';
import { Skill } from '@/utils/Skill';

const PlayerSkillUi: React.FC = () => {
  const [currentSkill, setCurrentSkill] = useState<Skill[]>([]);

  // TODO: 스킬 실시간 연동(쿨타임 연동이 되어야 함)
  useEffect(() => {
    return () => {
      
    };
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        right: 0,
        bottom: 0,
        width: '25%',
        height: 100,
        background: '#999999ee',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        padding: '5px',
        boxSizing: 'border-box',
        borderWidth: 3,
        borderStyle: 'solid',
        borderRadius: 5,
        borderColor: '#44444444',
        overflowY: 'hidden',
      }}
    >
      {currentSkill.map(skill => (
        <Image
          key={skill.name}
          src={skill.iconImgPath}
          alt={`Skill ${skill.name}`}
          width={50}
          height={50}
          style={{
            objectFit: 'cover',
          }}
        />
      ))}
    </div>
  );
};

export default PlayerSkillUi;
