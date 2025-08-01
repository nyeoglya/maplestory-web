"use client";

import EffectManager from './EffectManager';
import EntityManager from './EntityManager';
import { PlayerStat } from '@/utils/Utils';
import { Skill, SkillAttack, SkillPowerUp, SkillRecoverMana } from '@/utils/Skill';

class SkillManager {
  public skillCooltimeMap: Map<Skill, number> = new Map();
  public skillKeyMap: Map<string, Skill>;
  public skillList: Skill[];
  public entityManager: EntityManager;
  public skillCooltimeIntervalId: NodeJS.Timeout;
  public setCurrentSkill: ((newSkillList: Skill[]) => void) | undefined = undefined;

  constructor(
    public playerData: PlayerStat,
    initialEntityManager: EntityManager,
    effectManager: EffectManager
  ) {
    this.entityManager = initialEntityManager; // 클래스는 참조임

    this.skillCooltimeInterval = this.skillCooltimeInterval.bind(this);
    this.skillCooltimeIntervalId = setInterval(this.skillCooltimeInterval, 1000);
    this.skillKeyMap = new Map([
      ['w', new SkillAttack(effectManager)],
      ['e', new SkillPowerUp(effectManager)],
      ['r', new SkillRecoverMana(effectManager)]
    ]);
    this.skillList = Array.from(this.skillKeyMap.values());
  }

  public setCurrentEntityManager(entityManager: EntityManager) {
    this.entityManager = entityManager;
  }

  public updateSkillUi() {
    if (!this.setCurrentSkill) return;
    this.setCurrentSkill(this.skillList);
  }

  // 스킬 쿨타임 감소 iteration
  public skillCooltimeInterval() {
    if (this.skillCooltimeMap.size === 0) return;
    const cooltimeEndSkills: Skill[] = [];

    this.skillCooltimeMap.forEach((cooltime, skill) => {
      const newCooltime = cooltime - 1;
      skill.cooltimeLeft = newCooltime;
      if (newCooltime <= 0) {
        cooltimeEndSkills.push(skill);
      } else {
        this.skillCooltimeMap.set(skill, newCooltime);
      }
    });

    cooltimeEndSkills.forEach(skill => {
      skill.cooltimeLeft = 0;
      this.skillCooltimeMap.delete(skill);
    });

    this.updateSkillUi();
  }

  // 스킬 키 변경
  public changeSkillKey(skill: Skill, key: string) {

  };

  // 특정 키가 입력되었을 때의 스킬 사용
  public skillUse(skill: Skill, effectedPlayerData: PlayerStat, entityUuidList: string[]) {
    if (!this.skillCooltimeMap.has(skill) && skill.isSkillAvailable(effectedPlayerData)) {
      skill.consume(this.playerData);
      skill.performAction(this.entityManager, effectedPlayerData, entityUuidList);
      this.updateSkillUi();
    }
  }

  public skillSetCooltime(skill: Skill) {
    this.skillCooltimeMap.set(skill, skill.cooltime);
    skill.cooltimeLeft = skill.cooltime;
  }
}

export default SkillManager;
