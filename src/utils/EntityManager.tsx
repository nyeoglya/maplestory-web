import { Vector } from "matter";
import Entity from "@/components/PhaserEntity";
import { PlayerStat } from "./PlayerStat";

class EntityManager {
  public entityList: Entity[] = [];
  public entityMap: Map<string, Entity> = new Map();

  public createEntityMap() {
    for (const entity of this.entityList) {
      this.entityMap.set(entity.uuid, entity);
    }
  }

  public setEntitySpawnList(entitySpawnList: Vector[]) {
    this.spawnLocationList = entitySpawnList
  }

  constructor(
    public spawnLocationList: Vector[] = [],
    public entitySpawnCooltime: number = 30,
  ) {}

  // 엔티티가 주변 공격 시도
  public entityAttack(playerData: PlayerStat, collider: Phaser.Physics.Arcade.Sprite) {
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
