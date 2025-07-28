import { v4 as uuidv4 } from 'uuid';
import * as Phaser from 'phaser';
import Entity from './PhaserEntity';
import gameManager from '@/utils/manager/GameManager';
import { getDirectionVector, getRandomInt } from '@/utils/Utils';
import EntityBossHandTarget from './PhaserBossHandTargetEntity';
import EntityBossHand from './PhaserBossHandEntity';

enum BossPhaseStatus {
  CHICKEN,
  BR,
  PIZZA
};

enum BossDefaultStatus {
  FLY, // 날고 있음. 이때는 플레이어 위에 떠있음.
  GROUND, // 위치를 정하고 잠시 기다렸다가 활강. 중력을 받게 하면 됨.
  RETURN // 다시 되돌아감.
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

  public currentStatus: BossPhaseStatus = BossPhaseStatus.CHICKEN;
  public defaultStatus: BossDefaultStatus = BossDefaultStatus.FLY;
  public chickenCount: number = 0;
  protected bossHandTarget: EntityBossHandTarget | null = null;

  public bossEvent() {
    console.log('보스 이벤트 발생!!!');
    this.phaseDefault();
    // TODO: Phase calculation
    this.phaseBR();
  }

  constructor({
    scene,
    pos,
    texture = 'boss',
    health = 2000,
    scale = 0.3,
    affectGravity = true,
    isMove = true,
    damage = 200,
    speed = 0,
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

  /*
  Phase 치킨
  보스 몹은 phase가 끝날 때까지 위치 고정된 채로 존재.
  맵에 닭이 뛰노는 곳 몹인 갈리나/갈루스가 소환됨.
  소환된 몹은 보스 몹에게 점차 끌려가게 되며, 보스 몹과 닿으면 소멸됨, 이 방식으로 소멸된 닭이 10마리를 기록하는 경우, Phase가 끝나면서 획득한 메소 1억 당 데스카운트 1개를 회수해 감
  */
  public phaseChicken() {

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

  public introScene() {

  }

  public deathScene() {

  }

  public update(): void {
    if (!this.bossHandTarget) return;
    this.bossHandTarget.update();
  }
}

export default BossEntity;
