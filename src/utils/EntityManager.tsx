import { Vector } from "matter";
import Entity from "@/components/PhaserEntity";
import { PlayerStat } from "./interface";

class EntityManager {
  public entityList: Entity[] = [];

  constructor(
    spawnLocationList: Vector[] = [],
    entitySpawnCooltime: number = 30,
  ) {
    spawnLocationList.forEach((pos: Vector) => {
      // this.entityList.push(new TestEntityA(pos));
    });
  }

  // 엔티티가 주변 공격 시도
  public entityAttack(playerData: PlayerStat, collider: Phaser.Physics.Arcade.Sprite) {
    this.entityList.forEach((entity: Entity) => {
      entity.tryAttack(playerData, collider);
    });
  }

  // entity에게 데미지를 입히기
  public damageEntity(playerData: PlayerStat, collider: Phaser.Physics.Arcade.Sprite) {
    this.entityList.forEach((entity: Entity) => {
      entity.tryDamage(playerData, collider);
    })
  }
}

export default EntityManager;
