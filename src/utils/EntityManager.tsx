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
    public entitySpawnCooltime: number = 30000,
  ) {}

  // 엔티티 중에서 사망한 친구들은 초기 위치로 다시 복구
  public respawnEntities() {
    this.entityList.forEach((entity: Entity) => {
      if (entity.death) entity.respawn();
    });
  }

  // 엔티티가 주변 공격 시도
  public entityAttack(playerData: PlayerStat, collider: Phaser.Physics.Arcade.Sprite) {
    this.entityList.forEach((entity: Entity) => {
      if (entity.death) return;
      entity.tryAttack(playerData, collider);
    });
  }

  // entity에게 데미지를 입히기
  public damageEntities(damage: number, entityUuidList: string[], repeat: number = 1) {
    entityUuidList.forEach((entityUuid: string) => {
      this.entityMap.get(entityUuid)?.tryDamage(damage, repeat);
    })
  }
}

export default EntityManager;
