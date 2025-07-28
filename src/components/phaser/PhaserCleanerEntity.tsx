import { Vector } from "matter";
import Entity from "./PhaserEntity";
import gameManager from "@/utils/manager/GameManager";
import MesoEntity from "./PhaserMesoEntity";

class EntityCleaner extends Entity {
  public mainPlatform: Phaser.Physics.Arcade.StaticGroup | null = null;

  constructor(
    scene: Phaser.Scene,
    pos: Vector,
    leftEnd: number,
  ) {
    super(
      scene,
      pos.x,
      pos.y,
      'cleaner',
      200,
      0.3,
      true,
      true,
      20,
      80,
      'cleaner',
    );
    this.turnRightPos = 50;
    this.turnLeftPos = leftEnd - 50;
  };

  public update(time: number, delta: number): void {
    if (this.death) return;
    if (!this.isMove) {
      this.setVelocityX(0);
      return;
    }
    // TODO: collider를 이용해서 방향 전환
    if (this.x < this.turnRightPos) {
      this.directingLeft = false;
      this.sprite.setFlipX(!this.directingLeft);
    } else if (this.x > this.turnLeftPos) {
      this.directingLeft = true;
      this.sprite.setFlipX(!this.directingLeft);
    }
    if (!this.directingLeft) {
      this.setVelocityX(this.xSpeed);
    } else {
      this.setVelocityX(-this.xSpeed);
    }
  }

  public setDeath() {
    this.death = true;
    this.setVisible(false);
    if (!this.mainPlatform) return;
    const meso = new MesoEntity(this.scene, { x: this.x, y: this.y });
    this.scene.physics.add.collider(meso, this.mainPlatform);
    gameManager.droppedItems.push(meso);
  }
}

export default EntityCleaner;
