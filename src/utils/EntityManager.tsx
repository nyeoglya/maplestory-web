import { Vector } from "matter";
import Entity, { TestEntityA } from "@/components/PhaserEntity";
import { PlayerStat } from "./PlayerStat";

class EntityManager {
  public entityList: Entity[] = [];
  public entityMap: Map<string, Entity> = new Map();

  private createEntityMap(entityList: Entity[]): Map<string, Entity> {
    const entityMap = new Map<string, Entity>();

    for (const entity of entityList) {
      entityMap.set(entity.uuid, entity);
    }

    return entityMap;
  }

  public setEntitySpawnList(entitySpawnList: Vector[]) {
    this.spawnLocationList = entitySpawnList
  }

  public initializeEntityList(Phaser: any, scene: any) {
    this.entityList = []; // Clear existing entities
    this.entityMap = new Map(); // Clear existing map

    this.spawnLocationList.forEach((pos: Vector) => {
      const testEntityA = new TestEntityA(Phaser, scene, pos);
      this.entityList.push(testEntityA);
    });
    this.entityMap = this.createEntityMap(this.entityList);
  }

  constructor(
    public spawnLocationList: Vector[] = [],
    public entitySpawnCooltime: number = 30,
  ) {}

  // 엔티티가 주변 공격 시도
  public entityAttack(playerData: PlayerStat, collider: any) {
    this.entityList.forEach((entity: Entity) => {
      entity.tryAttack(playerData, collider);
    });
  }

  // entity에게 데미지를 입히기
  public damageEntities(damage: number, entityUuidList: string[]) {
    entityUuidList.forEach((entityUuid: string) => {
      this.entityMap.get(entityUuid)?.tryDamage(damage);
    })
  }
}

export default EntityManager;
