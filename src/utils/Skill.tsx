import { EffectTestA } from "./Effect";
import EffectManager from "@/utils/manager/EffectManager";
import EntityManager from "@/utils/manager/EntityManager";
import { getRandomInt, PlayerStat } from "./Utils";
import gameManager from "./manager/GameManager";

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

export class SkillAttack extends Skill {
  constructor(effectManager: EffectManager) {
    super(
      '공격',
      '공격 스킬입니다.',
      2,
      false,
      effectManager,
      '/assets/skill.png',
      'skillTestA',
    );
  }

  public isSkillAvailable(data: PlayerStat): boolean {
    return data.mana >= 10;
  }

  public consume(data: PlayerStat) {
    data.mana -= 10;
  }

  public performAction(entityManager: EntityManager, data: PlayerStat, entityUuidList: string[]) {
    entityManager.damageEntities(data.mainStat * getRandomInt(100000, 20000) + getRandomInt(0, 10000), entityUuidList, 7);
  }
}

export class SkillPowerUp extends Skill {
  constructor(effectManager: EffectManager) {
    super(
      '강화',
      '강화 스킬입니다.',
      10,
      false,
      effectManager,
      '/assets/skill.png',
      undefined
    );
  }

  public isSkillAvailable(data: PlayerStat): boolean {
    return data.mana >= 20;
  }

  public consume(data: PlayerStat) {
    data.mana -= 20;
  }

  public performAction(entityManager: EntityManager, data: PlayerStat, entityUuidList: string[]) {
    this.effectManager.addEffect(EffectTestA);
  }
}

export class SkillRecoverMana extends Skill {
  constructor(effectManager: EffectManager) {
    super(
      '마나 회복',
      '마나를 풀로 회복하는 스킬입니다.',
      25,
      false,
      effectManager,
      '/assets/skill.png',
      'skillTestA',
    );
  }

  public isSkillAvailable(data: PlayerStat): boolean {
    return true;
  }

  public performAction(entityManager: EntityManager, data: PlayerStat, entityUuidList: string[]) {
    const player = gameManager.player;
    player.mana += Math.floor(player.maxMana / 2);
    player.mana = Math.min(player.mana, player.maxMana);
  }
}
