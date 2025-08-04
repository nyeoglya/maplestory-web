import { v4 as uuidv4 } from 'uuid';
import * as Phaser from 'phaser';
import Entity from './PhaserEntity';
import { Vector } from 'matter';
import gameManager from '@/utils/manager/GameManager';

class EntityGalus extends Entity {

  public targetPos: Vector | null = null;
  protected speed = 30;

  constructor(
    public scene: Phaser.Scene,
    public pos: Vector,
    public texture: string = 'galus',
    public health: number = 50000000,
    public affectGravity: boolean = true,
    public isMove: boolean = true,
    public damage: number = 100,
    public xSpeed: number = 0,
    public name: string = 'galus',
    public healthBarVisible: boolean = true,
    public uuid: string = uuidv4(),
  ) {
    super(scene, pos.x, pos.y, texture, health, affectGravity, isMove, damage, xSpeed, name, healthBarVisible, uuid);
  }

  public update(): void {
    if (!this.targetPos || this.death) return;

    const direction = this.getCurrentPos().x - this.targetPos.x;

    if (direction === 0) return;
    else if (direction > 0) this.setVelocityX(-this.speed);
    else this.setVelocityX(this.speed);

    if (Math.abs(this.targetPos.x - this.getCurrentPos().x) < 20) {
      if (!gameManager.bossEntity) return;
      gameManager.bossEntity.addChickenCount();
      this.setDeath();
    }
  }

  public setDeath() {
    this.death = true;
    this.setVisible(false);
    this.destroy(true);
  }
}

export default EntityGalus;
