import { Vector } from "matter";
import { PlayerStat } from "./interface";
import { randomUUID } from "crypto";

export class Entity {
  public isDirectingLeft: boolean = true;

  constructor(
    public position: Vector = {x: 0, y: 0},
    public health: number = 100,
    public maxHealth: number = 100,
    public damage: number = 20,
    public speed: number = 20, 
    public isMove: boolean = true,
    public affectGravity: boolean = true,
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

export class TestEntityA extends Entity {
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

export class BossEntity extends Entity {
  constructor() {
    super();
    this.entityImgPath = '';
  }
}

class EntityManager {
  public entityList: Entity[] = [];

  constructor(
    spawnLocationList: Vector[] = [],
    entitySpawnCooltime: number = 30,
  ) {
    spawnLocationList.forEach((pos: Vector) => {
      this.entityList.push(new TestEntityA(pos));
    });
  }

  // 모든 entity에 대해 주변에 공격을 시도.
  public entityAttack(playerData: PlayerStat) {
    this.entityList.forEach((entity: Entity) => {
      console.log(entity);
      if (entity.health > 0 &&
        entity.isAttackAvailable(playerData)) {
        playerData = entity.attack(playerData);
      }
    });
    return playerData;
  }

  // 특정 조건에 맞는 entity를 전부 찾기
  public findEntity() {
    
  }

  // entity에게 데미지를 입히기 (임시)
  public damageEntity() {
    this.entityList.forEach((entity: Entity) => {
      if (entity.health > 0) {
        entity.health -= Math.min(entity.health, 20);
      }
    })
  }
}

export default EntityManager;
