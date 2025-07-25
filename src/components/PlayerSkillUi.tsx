import React, { useEffect, useState } from 'react';
import gameManager from '@/utils/GameManager';
import Image from 'next/image';
import { Skill } from '@/utils/Skill';

const PlayerSkillUi: React.FC = () => {
  const [currentSkill, setCurrentSkill] = useState<Skill[]>([]);

  // TODO: 스킬 실시간 연동(쿨타임 연동이 되어야 함)
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
            {currentSkill.map(skill => {
        const iconSize = 50; // 아이콘의 고정 크기
        // 쿨타임이 0이거나 스킬 자체가 쿨타임이 없는 경우를 처리
        const cooltimeRatio = (skill.cooltime && skill.cooltime > 0)
          ? skill.cooltimeLeft / skill.cooltime
          : 0; // 쿨타임이 없거나 이미 끝났다면 0

        const currentOverlayHeight = iconSize * cooltimeRatio;
        const overlayTop = iconSize - currentOverlayHeight; // 오버레이를 아래에서 위로 채우기 위한 top 값

        // 쿨타임 텍스트 표시 조건 (쿨타임이 0보다 클 때만)
        const showCooltimeText = skill.cooltimeLeft > 0;

        return (
          <div
            key={skill.name} // 스킬 이름이 고유하다고 가정
            style={{
              position: 'relative',
              width: iconSize,
              height: iconSize,
              overflow: 'hidden',
              borderRadius: '5px',
            }}
          >
            <Image
              src={skill.iconImgPath}
              alt={`Skill ${skill.name}`}
              width={iconSize}
              height={iconSize}
              style={{
                objectFit: 'cover',
                display: 'block', // 인라인 요소의 하단 공백 제거
              }}
            />
            {/* 쿨타임 오버레이 */}
            {cooltimeRatio > 0 && ( // 쿨타임이 남아있을 때만 오버레이 표시
              <div
                style={{
                  position: 'absolute',
                  backgroundColor: '#dddddd55', // 어두운 반투명 색상
                  top: overlayTop, // 계산된 top 값 적용
                  left: 0,
                  width: '100%',
                  height: currentOverlayHeight, // 계산된 높이 적용
                  zIndex: 2,
                }}
              >
                {showCooltimeText && Math.ceil(skill.cooltimeLeft)} {/* 텍스트는 올림하여 표시 */}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PlayerSkillUi;
