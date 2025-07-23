import EntityManager from "./Entity";
import {PlayerStat} from "./interface";

export abstract class Skill {
  constructor(
    public name: string,
    public description: string,
    public cooltime: number,
    public isPassive: boolean,
    public iconImgPath: string = '',
    public skillImgPath: string = '',
  ) {
    
  }

  // 현재 스킬이 사용 가능한 상태인지 체크 (쿨타임이랑 다른거)
  public isSkillAvailable(data: PlayerStat): boolean {
    return false;
  }

  // 자원의 소모
  public consume(data: PlayerStat) {}

  // 사용되는 스킬
  public performAction(data: PlayerStat, entityManager: EntityManager) {}
}

export class SkillTestA extends Skill {
  constructor() {
    super(
      '스킬 테스트 A',
      '테스트용 스킬입니다.',
      2,
      false,
      '/assets/skill.png',
      '/assets/skillUse.png',
    );
  }

  public isSkillAvailable(data: PlayerStat): boolean {
    return true;
  }

  public consume(data: PlayerStat) {
    data.mana -= 20;
  }

  public performAction(data: PlayerStat, entityManager: EntityManager) {
    entityManager.damageEntity();
  }
}

export class SkillTestB extends Skill {
  constructor() {
    super(
      '스킬 테스트 B',
      '테스트용 스킬입니다.',
      10,
      false,
      '/assets/skill.png',
      '/assets/skillUse.png',
    );
  }
}

export class SkillTestC extends Skill {
  constructor() {
    super(
      '스킬 테스트 C',
      '테스트용 스킬입니다.',
      10,
      false,
      '/assets/skill.png',
      '/assets/skillUse.png',
    );
  }
}
