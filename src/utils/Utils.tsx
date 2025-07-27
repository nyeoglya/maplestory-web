import Entity from "@/components/PhaserEntity";
import { Vector } from "matter";

export interface PlayerStat {
  position: Vector;
  name: string;
  health: number;
  maxHealth: number;
  mainStat: number;
  mana: number;
  maxMana: number;
  speed: Vector;
}

export function getOverlapEntity(
  scene: Phaser.Scene,
  detectionZone: Phaser.Physics.Arcade.StaticBody,
  targetGroup: Entity[],
): string[] {
  const overlapUuidList: string[] = [];
  if (!detectionZone) return [];

  targetGroup.forEach(entity => {
    const entityBody: Phaser.Physics.Arcade.Body = entity.getBody();
    if (!entityBody) return;
    
    scene.physics.overlap(detectionZone, entityBody, () => {
      overlapUuidList.push(entity.uuid);
    }, undefined, scene);
  });

  return overlapUuidList;
}
