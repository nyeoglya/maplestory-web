import { v4 as uuidv4 } from 'uuid';
import * as Phaser from 'phaser';
import Entity from './PhaserEntity';
import { Vector } from 'matter';

class BossEntity extends Entity {

  public bossTimeLeft: number = 30*60;

  constructor(
    public scene: Phaser.Scene,
    public pos: Vector,
    public texture: string = 'boss',
    public health: number = 2000,
    public scale: number = 0.3,
    public affectGravity: boolean = false,
    public isMove: boolean = true,
    public damage: number = 200,
    public speed: number = 0,
    public name: string = '',
    public healthBarVisible: boolean = false,
    public uuid: string = uuidv4(),
  ) {
    super(scene, pos.x, pos.y, texture, health, scale, affectGravity, isMove, damage, speed, name, healthBarVisible, uuid);
  }

  // 주변에 엔티티 소환. 통 같은거 떨구기.
  public phaseOnePattern() {
    
  }

  // 레이저 쏘기. 플레이어 쪽으로 이동하면서 공격.
  public phaseTwoPattern() {
    
  }

  public introScene() {

  }
  
  public deathScene() {
    
  }

  public update(): void {
    
  }
}

export default BossEntity;
