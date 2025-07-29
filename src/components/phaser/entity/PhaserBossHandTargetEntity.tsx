import { Vector } from "matter";
import Entity from "./PhaserEntity";
import { getDistance } from "@/utils/Utils";
import EntityBossHand from "./PhaserBossHandEntity";
import gameManager from "@/utils/manager/GameManager";

class EntityBossHandTarget extends Entity {

  constructor(
    protected handEntity: EntityBossHand,
    scene: Phaser.Scene,
    protected pos: Vector,
  ) {
    super(
      scene,
      pos.x,
      pos.y,
      'targetpos',
      100,
      false,
      true,
      0,
      0,
      '',
      false,
    );
  };

  // 타겟팅 시작
  public startTargeting(xPos: number) {
    this.respawn({ x: xPos, y: this.initialPos.y });
    this.x = xPos;
    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.handEntity.respawn({ x: xPos, y: 100 });
      },
      callbackScope: this,
      loop: false
    });
  }

  public update(): void {
    if (!this.handEntity || !gameManager.phaserPlayer || this.death) return;
    if (getDistance(this.getCurrentPos(), this.handEntity.getCurrentPos()) < 40) {
      this.handEntity.setDeath();
      this.setDeath();
    } else if (getDistance(gameManager.phaserPlayer?.getCurrentPos(), this.handEntity.getCurrentPos()) < 50) {
      this.handEntity.tryAttack(gameManager.player);
    }
  }

  public respawn(pos: Vector): void {
    this.death = false;
    this.currentHealth = this.maxHealth;
    this.x = pos.x;
    this.y = pos.y;
    this.setVisible(true);
  }
}


export default EntityBossHandTarget;
