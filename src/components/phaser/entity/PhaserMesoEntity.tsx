import { v4 as uuidv4 } from 'uuid';
import * as Phaser from 'phaser';
import Entity from './PhaserEntity';
import { Vector } from 'matter';

class MesoEntity extends Entity {

  constructor(
    public scene: Phaser.Scene,
    public pos: Vector,
    public texture: string = 'meso',
    public health: number = 1,
    public scale: number = 1.0,
    public affectGravity: boolean = true,
    public isMove: boolean = false,
    public damage: number = 0,
    public xSpeed: number = 0,
    public name: string = 'meso',
    public healthBarVisible: boolean = false,
    public uuid: string = uuidv4(),
  ) {
    super(scene, pos.x, pos.y, texture, health, scale, affectGravity, isMove, damage, xSpeed, name, healthBarVisible, uuid);
    this.setVelocityX(0);
    this.setVelocityY(-100);
  }

  public update(): void {

  }
}

export default MesoEntity;
