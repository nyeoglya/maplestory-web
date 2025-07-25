import { v4 as uuidv4 } from 'uuid';
import * as Phaser from 'phaser';
import Entity from './PhaserEntity';

class BossEntity extends Entity {

  constructor(
    public scene: Phaser.Scene,
    public x: number,
    public y: number,
    public texture: string,
    public health: number,
    public scale: number,
    public affectGravity: boolean = true,
    public isMove: boolean = true,
    public damage: number = 20,
    public speed: number = 50,
    public name: string = '',
    public uuid: string = uuidv4(),
  ) {
    super(scene, x, y, texture, health, scale);
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
}

export default BossEntity;
