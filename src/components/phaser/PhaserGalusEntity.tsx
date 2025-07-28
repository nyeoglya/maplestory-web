import { v4 as uuidv4 } from 'uuid';
import * as Phaser from 'phaser';
import Entity from './PhaserEntity';
import { Vector } from 'matter';
import { getDirectionVector, getDistance } from '@/utils/Utils';

class EntityGalus extends Entity {

  public targetPos: Vector | null = null;
  protected speed = 30;

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
    public name: string = '',
    public healthBarVisible: boolean = true,
    public uuid: string = uuidv4(),
  ) {
    super(scene, pos.x, pos.y, texture, health, scale, affectGravity, isMove, damage, xSpeed, name, healthBarVisible, uuid);
  }

  public update(): void {
    if (!this.targetPos || this.death) return;

    const direction = getDirectionVector(this.getCurrentPos(), this.targetPos);
    if (direction.x === 0 && direction.y === 0) return;
    this.setVelocityX(direction.x * this.speed);
    this.setVelocityY(direction.y * this.speed);

    if (getDistance(this.targetPos, this.getCurrentPos()) < 10) {
      console.log('잡아먹혔다!!!');
      this.setDeath();
    }
  }
}

export default EntityGalus;
