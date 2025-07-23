import EntityManager from './Entity';
import gameManager from './GameManager';
import { PlayerStat } from './interface';
import keyboardManager from './KeyManager';
import {Skill, SkillTestA, SkillTestB, SkillTestC} from './Skill';

class SkillManager {
  public skillCooltimeMap: Map<Skill, number> = new Map();
  public skillKeyMap: Map<string, Skill> = new Map([
    ['w', new SkillTestA()],
    ['e', new SkillTestB()],
    ['a', new SkillTestC()]
  ]);
  public skillList: Skill[] = Array.from(this.skillKeyMap.values());
  public entityManager: EntityManager;
  public skillCooltimeIntervalId: NodeJS.Timeout;

  constructor(entityManager: EntityManager) {
    this.entityManager = entityManager; // 클래스는 참조임
    
    this.skillKeyMap.forEach((skill: Skill, key: string) => {
      keyboardManager.onKeyDown(key, (event: KeyboardEvent) => {
        event.preventDefault();
        this.skillUse(skill, gameManager.player);
      });
    });

    this.skillCooltimeInterval = this.skillCooltimeInterval.bind(this);
    this.skillCooltimeIntervalId = setInterval(this.skillCooltimeInterval, 1000);
  }

  // 스킬 쿨타임 감소 iteration
  public skillCooltimeInterval() {
    if (this.skillCooltimeMap.size === 0) return;
    const cooltimeEndSkills: Skill[] = [];

    this.skillCooltimeMap.forEach((cooltime, skill) => {
      const newCooltime = cooltime - 1;
      if (newCooltime <= 0) {
        cooltimeEndSkills.push(skill);
      } else {
        this.skillCooltimeMap.set(skill, newCooltime);
      }
    });

    cooltimeEndSkills.forEach(skill => {
      this.skillCooltimeMap.delete(skill);
    });
  }

  // 스킬 키 변경
  public changeSkillKey(skill: Skill, key: string) {

  };

  // 특정 키가 입력되었을 때의 스킬 사용
  public skillUse(skill: Skill, playerData: PlayerStat) {
    if (!this.skillCooltimeMap.has(skill) &&
      skill.isSkillAvailable(playerData)) {
      skill.consume(playerData);
      skill.performAction(playerData, this.entityManager);
      this.skillCooltimeMap.set(skill, skill.cooltime);
    }
  }
}

export default SkillManager;
