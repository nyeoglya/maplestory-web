import { v4 as uuidv4 } from 'uuid';
import * as Phaser from 'phaser';
import Entity from './PhaserEntity';
import { Vector } from 'matter';
import gameManager from '@/utils/manager/GameManager';
import { getDistance } from '@/utils/Utils';

class EntityFalling extends Entity {

  protected speed = 80;
  public targetPos: Vector | null = null;

  constructor(
    public scene: Phaser.Scene,
    public pos: Vector,
    public texture: string = 'galus',
    public health: number = 100,
    public scale: number = 0.3,
    public affectGravity: boolean = true,
    public isMove: boolean = true,
    public damage: number = 100,
    public xSpeed: number = 0,
    public name: string = 'galus',
    public healthBarVisible: boolean = true,
    public uuid: string = uuidv4(),
  ) {
    super(scene, pos.x, pos.y, texture, health, scale, affectGravity, isMove, damage, xSpeed, name, healthBarVisible, uuid);
  }

  public update(): void {
    if (!this.targetPos || !gameManager.phaserPlayer || this.death) return;

    this.setVelocityY(-this.speed);

    if (Math.abs(this.targetPos.y - this.getCurrentPos().y) < 10) {
      this.setDeath();
    } else if (getDistance(gameManager.phaserPlayer.getCurrentPos(), this.getCurrentPos()) < 10) {
      this.setDeath();
    }
  }
}

export default EntityFalling;
