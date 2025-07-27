import { v4 as uuidv4 } from 'uuid';
import * as Phaser from 'phaser';
import Entity from './PhaserEntity';
import { Vector } from 'matter';

class FloatingEntity extends Entity {

  constructor(
    public scene: Phaser.Scene,
    public pos: Vector,
    public texture: string = 'rock',
    public health: number = 9999999,
    public scale: number = 2,
    public affectGravity: boolean = false,
    public isMove: boolean = true,
    public damage: number = 100,
    public xSpeed: number = 0,
    public name: string = '',
    public healthBarVisible: boolean = false,
    public uuid: string = uuidv4(),
  ) {
    super(scene, pos.x, pos.y, texture, health, scale, affectGravity, isMove, damage, xSpeed, name, healthBarVisible, uuid);
    this.setVelocityX(0);
    this.setVelocityY(50);
  }

  public update(): void {

  }
}

export default FloatingEntity;
