import { v4 as uuidv4 } from 'uuid';
import * as Phaser from 'phaser';
import Entity from './PhaserEntity';
import gameManager from '@/utils/manager/GameManager';
import { getDirectionVector, getRandomInt } from '@/utils/Utils';
import EntityBossHandTarget from './PhaserBossHandTargetEntity';
import EntityBossHand from './PhaserBossHandEntity';
import EntityGalus from './PhaserGalusEntity';

enum BossPhaseStatus {
  CHICKEN,
  BR,
  PIZZA
};

interface BossConfig {
  scene: Phaser.Scene;
  pos: { x: number; y: number };
  texture?: string;
  health?: number;
  scale?: number;
  affectGravity?: boolean;
  isMove?: boolean;
  damage?: number;
  speed?: number;
  name?: string;
  floorY?: number;
  healthBarVisible?: boolean;
  uuid?: string;
}

class BossEntity extends Entity {
  public bossTimeLeft: number = 30 * 60;

  public chickenCount: number = 0;
  protected bossHandTarget: EntityBossHandTarget | null = null;
  public mainPlatform: Phaser.Physics.Arcade.StaticGroup | null = null;

  public targetX: number = 0;

  public getPhase(): BossPhaseStatus {
    const nowTime = 150 - this.bossTimeLeft % 150;
    if (0 <= nowTime && nowTime < 60) {
      return BossPhaseStatus.CHICKEN;
    } else if (60 <= nowTime && nowTime < 120) {
      if (this.chickenCount >= 0) {
        gameManager.bossEntityManager
          .removeEntities((entity: Entity) => entity instanceof EntityGalus);
        this.chickenCount = -1;
      }
      return BossPhaseStatus.BR;
    } else {
      this.chickenCount = 0;
      return BossPhaseStatus.PIZZA;
    }
  }

  public bossEvent() {
    this.phaseDefault();
    switch (this.getPhase()) {
      case BossPhaseStatus.CHICKEN: {
        this.phaseChicken();
        break;
      }
      case BossPhaseStatus.BR: {
        this.phaseBR();
        break;
      }
      case BossPhaseStatus.PIZZA: {
        this.phasePizza();
        break;
      }
    }
  }

  public addChickenCount() {
    this.chickenCount += 1;
    if (!gameManager.phaserPlayer) return;
    if (this.chickenCount >= 5) {
      gameManager.phaserPlayer.setDeath();
      this.chickenCount = 0;
    }
  }

  constructor({
    scene,
    pos,
    texture = 'boss',
    health = 3000000000,
    scale = 1.0,
    affectGravity = true,
    isMove = false,
    damage = 200,
    speed = 50,
    floorY = 0,
    name = 'boss',
    healthBarVisible = false,
    uuid = uuidv4(),
  }: BossConfig) {
    super(scene, pos.x, pos.y, texture, health, scale, affectGravity, isMove, damage, speed, name, healthBarVisible, uuid);

    const newBossHand = new EntityBossHand(scene, { x: pos.x, y: 0 });
    this.bossHandTarget = new EntityBossHandTarget(newBossHand, scene, { x: pos.x, y: floorY });
    newBossHand.setDeath();
    this.bossHandTarget.setDeath();

    this.scene.time.addEvent({
      delay: 5000,
      callback: this.bossEvent,
      callbackScope: this,
      loop: true
    });

    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.bossTimeLeft -= 1;
      },
      callbackScope: this,
      loop: true
    })
  }

  // TODO: 지금까지 섭취한 치킨의 수 표시하기(보스바에 흰색으로 표시?)
  public phaseChicken() {
    if (!this.mainPlatform) return;
    const randomX = getRandomInt(0, 1000);
    const galus = new EntityGalus(this.scene, { x: randomX, y: 500 });
    galus.targetPos = this.getCurrentPos();
    gameManager.bossEntityManager.entityList.push(galus);
    gameManager.bossEntityManager.resetEntityMap();
    this.scene.physics.add.collider(galus, this.mainPlatform);
  }

  public phaseBR() {
    gameManager.fallingEntityManager.respawnEntities();
  }

  public phasePizza() {
    if (!gameManager.pizzaEntity || !gameManager.phaserPlayer) return;
    gameManager.pizzaEntity.targetDirection = getDirectionVector(
      this.getCurrentPos(),
      gameManager.phaserPlayer.getCurrentPos(),
    );
    gameManager.pizzaEntity.respawn(this.getCurrentPos());
  }

  public phaseDefault() {
    gameManager.normalEntityManager.respawnEntities();
    const randomX = getRandomInt(0, 1000);
    this.bossHandTarget?.startTargeting(randomX);
  }

  public setNewTargetX() {
    this.targetX = getRandomInt(0, 1000);
    this.isMove = true;
  }

  public update(): void {
    if (!this.bossHandTarget) return;
    this.bossHandTarget.update();

    if (!this.isMove || this.getPhase() == BossPhaseStatus.CHICKEN) {
      this.setVelocityX(0);
      return;
    }

    const directionX = this.x - this.targetX <= 0 ? 1 : -1;
    this.setVelocityX(directionX * this.xSpeed);
    if (Math.abs(this.x - this.targetX) < 100) {
      this.isMove = false;
      this.setNewTargetX(); // TODO: 시간 지연 넣기
    }
  }
}

export default BossEntity;
