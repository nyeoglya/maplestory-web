import { v4 as uuidv4 } from 'uuid';
import * as Phaser from 'phaser';
import Entity from './PhaserEntity';
import { Vector } from 'matter';
import { getDirectionVector, getDistance } from '@/utils/Utils';
import gameManager from '@/utils/manager/GameManager';
import emitter from '@/utils/EventBus';

interface EntityPizzaConfig {
  scene: Phaser.Scene;
  pos: Vector;
  texture?: string;
  health?: number;
  affectGravity?: boolean;
  isMove?: boolean;
  damage?: number;
  xSpeed?: number;
  name?: string;
  healthBarVisible?: boolean;
  uuid?: string;
}

class EntityPizza extends Entity {
  public targetDirection: Vector | null = null;
  protected speed = 200;

  constructor({
    scene,
    pos,
    texture = 'pizza',
    health = 2,
    affectGravity = false,
    isMove = true,
    damage = 100,
    xSpeed = 0,
    name = 'pizza',
    healthBarVisible = false,
    uuid = uuidv4(),
  }: EntityPizzaConfig) {
    super(scene, pos.x, pos.y, texture, health, affectGravity, isMove, damage, xSpeed, name, healthBarVisible, uuid);
  }

  public update(): void {
    if (!this.targetDirection || !gameManager.phaserPlayer || this.death) return;

    this.setVelocityX(this.targetDirection.x * this.speed);
    this.setVelocityY(this.targetDirection.y * this.speed);

    if (getDistance(gameManager.phaserPlayer?.getCurrentPos(), this.getCurrentPos()) < 50) {
      this.tryAttack(gameManager.player);
      emitter.emit('captcha');
      this.setDeath();
    } else if (gameManager.phaserPlayer?.getCurrentPos().x < 100 || gameManager.phaserPlayer?.getCurrentPos().x > gameManager.gameWidth - 100) {
      this.setDeath();
    }
  }
}

export default EntityPizza;
