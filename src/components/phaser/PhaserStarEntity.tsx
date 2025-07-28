import { v4 as uuidv4 } from 'uuid';
import * as Phaser from 'phaser';
import Entity from './PhaserEntity';
import gameManager from '@/utils/manager/GameManager';
import { getDirectionVector, getRandomInt } from '@/utils/Utils';
import EntityBossHandTarget from './PhaserBossHandTargetEntity';
import EntityBossHand from './PhaserBossHandEntity';
import { Vector } from 'matter';

class StarEntity extends Entity {
  public bossTimeLeft: number = 30 * 60;

  public isShow: boolean = false;
  public effectProbability: number[] = [100 / 90 / 70 / 50 / 30 / 20 / 10 / 5 / 4 / 3 / 2 / 1];
  public effectStack: number = 0;

  constructor(
    public scene: Phaser.Scene,
    public pos: Vector,
    public texture: string,
    public health: number,
    public scale: number,
    public affectGravity: boolean = true,
    public isMove: boolean = true,
    public damage: number = 20,
    public xSpeed: number = 50,
    public name: string = '',
    public healthBarVisible: boolean = true,
    public uuid: string = uuidv4(),
  ) {
    super(scene, pos.x, pos.y, texture, health, scale, affectGravity, isMove, damage, speed, name, healthBarVisible, uuid);
  }

  public update(): void { }
}

export default StarEntity;
