import Entity from "@/components/phaser/entity/PhaserEntity";
import NPC from "@/components/phaser/npc/PhaserNPC";
import { Vector } from "matter";

export interface PlayerStat {
  name: string;
  health: number;
  maxHealth: number;
  mainStat: number;
  mana: number;
  maxMana: number;
  speed: Vector;
  isMove: boolean;
  flipKey: boolean;
  damageMultiplier: number;
  attackMultiplier: number;
  level: number;
}

export function getDistance(v1: Vector, v2: Vector): number {
  const dx = v2.x - v1.x;
  const dy = v2.y - v1.y;
  return Math.hypot(dx, dy);
};

export function getDirectionVector(from: Vector, to: Vector): Vector {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  if (length === 0) return { x: 0, y: 0 };
  return { x: dx / length, y: dy / length };
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

export function getOverlapNPC(
  scene: Phaser.Scene,
  detectionZone: Phaser.Physics.Arcade.StaticBody,
  targetGroup: NPC[],
): NPC[] {
  const overlapNPCList: NPC[] = [];
  if (!detectionZone) return [];

  targetGroup.forEach(npc => {
    const npcBody: Phaser.Physics.Arcade.Body = npc.getBody();
    if (!npcBody) return;

    scene.physics.overlap(detectionZone, npcBody, () => {
      overlapNPCList.push(npc);
    }, undefined, scene);
  });

  return overlapNPCList;
}
