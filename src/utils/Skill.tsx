import { EffectTestA } from "./Effect";
import EffectManager from "@/utils/manager/EffectManager";
import EntityManager from "@/utils/manager/EntityManager";
import { getRandomInt, PlayerStat } from "./Utils";

export abstract class Skill {
  public cooltimeLeft: number = 0;
  constructor(
    public name: string,
    public description: string,
    public cooltime: number,
    public isPassive: boolean,
    public effectManager: EffectManager,
    public iconImgPath: string = '',
    public skillImgPath: string | undefined = '',
  ) {

  }

  // 현재 스킬이 사용 가능한 상태인지 체크 (쿨타임이랑 다른거)
  public isSkillAvailable(data: PlayerStat): boolean {
    return false;
  }

  // 자원의 소모
  public consume(data: PlayerStat) { }

  // 사용되는 스킬
  public performAction(entityManager: EntityManager, data: PlayerStat, entityUuidList: string[]) { }
}

export class SkillTestA extends Skill {
  constructor(effectManager: EffectManager) {
    super(
      '스킬 테스트 A',
      '테스트용 스킬입니다.',
      2,
      false,
      effectManager,
      '/assets/skill.png',
      'skillTestA',
    );
  }

  public isSkillAvailable(data: PlayerStat): boolean {
    return true;
  }

  public consume(data: PlayerStat) {
    data.mana -= 10;
  }

  public performAction(entityManager: EntityManager, data: PlayerStat, entityUuidList: string[]) {
    entityManager.damageEntities(data.mainStat * getRandomInt(100000, 20000) + getRandomInt(0, 10000), entityUuidList, 7);
  }
}

export class SkillTestB extends Skill {
  constructor(effectManager: EffectManager) {
    super(
      '스킬 테스트 B',
      '테스트용 스킬입니다.',
      10,
      false,
      effectManager,
      '/assets/skill.png',
      undefined
    );
  }

  public isSkillAvailable(data: PlayerStat): boolean {
    return true;
  }

  public consume(data: PlayerStat) {
    data.mana -= 50;
  }

  public performAction(entityManager: EntityManager, data: PlayerStat, entityUuidList: string[]) {
    this.effectManager.addEffect(EffectTestA);
  }
}

export class SkillTestC extends Skill {
  constructor(effectManager: EffectManager) {
    super(
      '스킬 테스트 C',
      '테스트용 스킬입니다.',
      10,
      false,
      effectManager,
      '/assets/skill.png',
      'skillTestA',
    );
  }
}
