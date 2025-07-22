import { Vector } from "matter";
import { PlayerStat } from "./interface";

class Entity {
  constructor(
    public health: number = 100,
    public damage: number = 20,
    public position: Vector = {} as Vector,
    public entityImgPath: string = '',
  ) {}

  // 플레이어 공격이 가능한지 확인
  public isAttackAvailable(data: PlayerStat): boolean {
    return false;
  }
  
  // 공격하고 그 결과를 반환
  public attack(data: PlayerStat): PlayerStat {
    return data;
  }
}

class BossEntity extends Entity {
  constructor() {
    super();
    this.entityImgPath = '';
  }
}

class EntityManager {
  public currentEntityList: Entity[] = [];

  constructor() {
    
  }

  // 모든 entity에 대해 주변에 공격을 시도.
  public entityAttack(data: PlayerStat) {

  }
}

export default EntityManager;
