import React, { useEffect, useState } from 'react';
import gameManager from '@/utils/manager/GameManager';
import Image from 'next/image';
import { Skill } from '@/utils/Skill';

const PlayerSkillUi: React.FC = () => {
  const [currentSkill, setCurrentSkill] = useState<Skill[]>([]);

  useEffect(() => {
    const handleSkillUpdate = (newSkillList: Skill[]) => {
      setCurrentSkill([...newSkillList]);
    };

    gameManager.skillManager.setCurrentSkill = handleSkillUpdate;
    gameManager.skillManager.updateSkillUi();

    return () => {
      gameManager.skillManager.setCurrentSkill = undefined;
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
        background: '#46515188',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        padding: '5px',
        boxSizing: 'border-box',
        borderTopLeftRadius: 10,
        overflowY: 'hidden',
      }}
    >
      {currentSkill.map(skill => {
        const iconSize = 50;
        const cooltimeRatio = (skill.cooltime && skill.cooltime > 0) ? skill.cooltimeLeft / skill.cooltime : 0;

        const currentOverlayHeight = iconSize * cooltimeRatio;
        const overlayTop = iconSize - currentOverlayHeight;
        const showCooltimeText = skill.cooltimeLeft > 0;

        return (
          <div
            key={skill.name}
            style={{
              position: 'relative',
              width: iconSize,
              height: iconSize,
              overflow: 'hidden',
              borderRadius: 5,
            }}
          >
            <Image
              src={skill.iconImgPath}
              alt={`Skill ${skill.name}`}
              width={iconSize}
              height={iconSize}
              style={{
                objectFit: 'cover',
                display: 'block', // 인라인 요소 하단 공백 제거
              }}
            />
            {cooltimeRatio > 0 && (
              <div
                style={{
                  position: 'absolute',
                  backgroundColor: '#46515188',
                  top: overlayTop,
                  left: 0,
                  width: '100%',
                  height: currentOverlayHeight,
                  zIndex: 2,
                }}
              >
                {showCooltimeText && skill.cooltimeLeft}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PlayerSkillUi;
