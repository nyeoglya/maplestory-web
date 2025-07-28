import { v4 as uuidv4 } from 'uuid';
import * as Phaser from 'phaser';
import Entity from './PhaserEntity';
import { Vector } from 'matter';
import gameManager from '@/utils/manager/GameManager';
import { getDistance, getRandomInt } from '@/utils/Utils';
import { DebuffEum, DebuffGreenTea, DebuffMint, Effect } from '@/utils/Effect';

class EntityFalling extends Entity {

  protected speed = 80;
  public targetPosY: number = 700;
  public debuffType: new () => Effect = DebuffMint;

  constructor(
    public scene: Phaser.Scene,
    public pos: Vector,
    public texture: string = 'baskinrabins',
    public health: number = 100,
    public scale: number = 1,
    public affectGravity: boolean = false,
    public isMove: boolean = true,
    public damage: number = 100,
    public xSpeed: number = 0,
    public name: string = 'baskinrabins',
    public healthBarVisible: boolean = false,
    public uuid: string = uuidv4(),
  ) {
    super(scene, pos.x, pos.y, texture, health, scale, affectGravity, isMove, damage, xSpeed, name, healthBarVisible, uuid);
    this.sprite.setFlipX(true);
  }

  public update(): void {
    if (!gameManager.phaserPlayer || this.death) return;

    this.setVelocityY(this.speed);

    if (Math.abs(this.targetPosY - this.getCurrentPos().y) < 10) {
      this.setDeath();
    } else if (getDistance(gameManager.phaserPlayer.getCurrentPos(), this.getCurrentPos()) < 50) {
      this.tryAttack(gameManager.player, gameManager.phaserPlayer);
      gameManager.effectManager.addEffect(this.debuffType);
      this.setDeath();
    }
  }

  public respawn(pos?: Vector): void {
    this.death = false;
    this.x = getRandomInt(0, 1000);
    this.y = 0;
    this.speed = getRandomInt(50, 200);
    this.setVisible(true);
  }
}

export class EntityFallingMint extends EntityFalling {

  protected speed = 80;
  public targetPosY: number = 700;

  constructor(
    public scene: Phaser.Scene,
    public pos: Vector,
    public texture: string = 'brmint',
    public health: number = 100,
    public scale: number = 1,
    public affectGravity: boolean = false,
    public isMove: boolean = true,
    public damage: number = 100,
    public xSpeed: number = 0,
    public name: string = 'brmint',
    public healthBarVisible: boolean = false,
    public uuid: string = uuidv4(),
  ) {
    super(scene, pos, texture, health, scale, affectGravity, isMove, damage, xSpeed, name, healthBarVisible, uuid);
    this.debuffType = DebuffMint;
  }
}

export class EntityFallingEum extends EntityFalling {

  protected speed = 80;
  public targetPosY: number = 700;

  constructor(
    public scene: Phaser.Scene,
    public pos: Vector,
    public texture: string = 'breum',
    public health: number = 100,
    public scale: number = 1,
    public affectGravity: boolean = false,
    public isMove: boolean = true,
    public damage: number = 100,
    public xSpeed: number = 0,
    public name: string = 'breum',
    public healthBarVisible: boolean = false,
    public uuid: string = uuidv4(),
  ) {
    super(scene, pos, texture, health, scale, affectGravity, isMove, damage, xSpeed, name, healthBarVisible, uuid);
    this.debuffType = DebuffEum;
  }
}

export class EntityFallingGreenTea extends EntityFalling {

  protected speed = 80;
  public targetPosY: number = 700;

  constructor(
    public scene: Phaser.Scene,
    public pos: Vector,
    public texture: string = 'brgreentea',
    public health: number = 100,
    public scale: number = 1,
    public affectGravity: boolean = false,
    public isMove: boolean = true,
    public damage: number = 100,
    public xSpeed: number = 0,
    public name: string = 'brgreentea',
    public healthBarVisible: boolean = false,
    public uuid: string = uuidv4(),
  ) {
    super(scene, pos, texture, health, scale, affectGravity, isMove, damage, xSpeed, name, healthBarVisible, uuid);
    this.debuffType = DebuffGreenTea;
  }
}

export default EntityFalling;
