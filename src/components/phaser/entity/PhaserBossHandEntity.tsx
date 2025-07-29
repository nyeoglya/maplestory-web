import { Vector } from "matter";
import Entity from "./PhaserEntity";
import { PlayerStat } from "@/utils/Utils";

class EntityBossHand extends Entity {

  constructor(
    scene: Phaser.Scene,
    pos: Vector,
  ) {
    super(
      scene,
      pos.x,
      pos.y,
      'bossHand',
      1000000000000,
      false,
      true,
      50,
      0,
      'bossHand',
      false,
    );
  };

  public tryAttack(data: PlayerStat, collider: Phaser.Physics.Arcade.Sprite | undefined = undefined) {
    if (this.death) return;
    if (!collider) {
      data.health -= Math.min(this.damage, data.health);
      this.setDeath();
    } else {
      this.scene.physics.overlap(this.getBody(), collider, () => {
        data.health -= Math.min(this.damage, data.health);
      }, undefined, this);
    }
  }

  public update(time: number, delta: number): void { }

  public setDeath(): void {
    this.death = true;
    this.setVisible(false);
    this.setVelocityY(0);
  }

  public respawn(pos: Vector): void {
    this.death = false;
    this.currentHealth = this.maxHealth;
    this.x = pos.x;
    this.y = pos.y;
    this.setVisible(true);
    this.setVelocityY(1000);
  }
}


export default EntityBossHand;
