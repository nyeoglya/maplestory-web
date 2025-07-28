import { v4 as uuidv4 } from 'uuid';
import * as Phaser from 'phaser';
import Entity from './PhaserEntity';
import { Vector } from 'matter';
import { randomInt } from 'crypto';

class EntityStar extends Entity {
  public bossTimeLeft: number = 30 * 60;

  public isShow: boolean = false;
  public effectProbability: number[] = [100, 90, 70, 50, 30, 20, 10, 5, 4, 3, 2, 1];
  public effectStack: number = 0;

  constructor(
    public scene: Phaser.Scene,
    public pos: Vector,
    public texture: string = 'star',
    public health: number = 1,
    public scale: number = 1,
    public affectGravity: boolean = false,
    public isMove: boolean = false,
    public damage: number = 0,
    public speed: number = 0,
    public name: string = 'star',
    public healthBarVisible: boolean = false,
    public uuid: string = uuidv4(),
  ) {
    super(scene, pos.x, pos.y, texture, health, scale, affectGravity, isMove, damage, speed, name, healthBarVisible, uuid);
  }

  // 랜덤 가챠 시작
  public rollDie() {
    const randomNum = randomInt(100) + 1;

  }

  public update(): void { }
}

export default EntityStar;
