import { Vector } from "matter";
import { PlayerStat } from "./interface";

class Entity {
  public isDirectingLeft: boolean = true;

  constructor(
    public health: number = 100,
    public damage: number = 20,
    public speed: number = 20, 
    public isMove: boolean = true,
    public affectGravity: boolean = true,
    public position: Vector | null = null,
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

class TestEntityA extends Entity {
  constructor(initialPos: Vector) {
    super();
    this.position = initialPos;
    this.entityImgPath = '';
  }

  public isAttackAvailable(data: PlayerStat): boolean {
    return true;
  }

  public attack(data: PlayerStat): PlayerStat {
    data.health -= Math.min(20, data.health);
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
  public currentEntityList: Entity[] = [
    new TestEntityA({x: 50, y: 200}),
  ];

  constructor() {
    
  }

  // 모든 entity에 대해 주변에 공격을 시도.
  public entityAttack(playerData: PlayerStat) {
    this.currentEntityList.forEach(entity => {
      if (entity.isAttackAvailable(playerData)) {
        playerData = entity.attack(playerData);
      }
    });
    return playerData;
  }
}

export default EntityManager;
