import { v4 as uuidv4 } from 'uuid';
import * as Phaser from 'phaser';
import Entity from './PhaserEntity';
import { Vector } from 'matter';
import { getRandomInt } from '@/utils/Utils';
import gameManager from '@/utils/manager/GameManager';
import { BuffStarForce, DebuffStarForce } from '@/utils/Effect';

class EntityStar extends Entity {
  public bossTimeLeft: number = 30 * 60;

  public isShow: boolean = false;
  public effectProbability: number[] = [100, 90, 70, 50, 30, 20, 10, 5, 4, 3, 2, 1];
  public effectStack: number = 0;

  public pressStartTime: number | null = null;
  public holdingDuration: number = 0;

  // TODO: 플레이어와 스타가 겹치지 않아도 게이지가 올라가는 버그가 있음.
  public increaseStarLevel() {
    if (!this.pressStartTime || !gameManager.phaserPlayer) return;
    if (gameManager.phaserPlayer.mesoCount < 15) return;
    if (this.currentHealth >= this.maxHealth) {
      this.tryStarForce();
    }
    this.currentHealth = this.maxHealth * this.holdingDuration / 3.0;
    this.updateHealthBar(this.currentHealth);
  }

  public tryStarForce() {
    if (!gameManager.phaserPlayer) return;
    const randomNum = getRandomInt(1, 100);
    gameManager.phaserPlayer.mesoCount -= 15;
    if (randomNum <= this.effectProbability[this.effectStack]) {
      this.effectStack += 1;
      gameManager.effectManager.addEffect(BuffStarForce);
      gameManager.player.mainStat += 10;
    } else {
      gameManager.effectManager.addEffect(DebuffStarForce);
      gameManager.player.mainStat -= 5;
    }
    this.resetPressTime();
    this.setVisible(false);
  }

  public resetPressTime() {
    this.pressStartTime = null;
    this.currentHealth = 0;
    this.updateHealthBar(this.currentHealth);
  }

  constructor(
    public scene: Phaser.Scene,
    public pos: Vector,
    public texture: string = 'starforce',
    public health: number = 0,
    public affectGravity: boolean = false,
    public isMove: boolean = false,
    public damage: number = 0,
    public speed: number = 0,
    public name: string = 'starforce',
    public healthBarVisible: boolean = true,
    public uuid: string = uuidv4(),
  ) {
    super(scene, pos.x, pos.y, texture, health, affectGravity, isMove, damage, speed, name, healthBarVisible, uuid);
    this.maxHealth = 100;
  }

  public createHealthBar() {
    const barYOffset = -this.sprite.displayHeight / 2;

    this.healthBarBackground = this.scene.add.graphics();
    this.healthBarBackground.fillStyle(0x777777, 0.8);
    this.healthBarBackground.fillRect(-60, barYOffset, 120, 5);
    this.add(this.healthBarBackground);

    this.healthBar = this.scene.add.graphics();
    this.healthBar.fillStyle(0x33eeff, 1);
    this.healthBar.fillRect(-60, barYOffset, 120, 5);
    this.add(this.healthBar);

    this.updateHealthBarVisibility(this.healthBarVisible);
    this.updateHealthBar(this.currentHealth);
  }

  protected updateHealthBar(currentHealth: number): void {
    if (!this.healthBar) return;
    if (!this.healthBarVisible) return;
    this.currentHealth = currentHealth;
    this.healthBar.clear();

    const healthPercentage = this.currentHealth / this.maxHealth;
    const barWidth = 120 * healthPercentage;

    const barYOffset = -this.sprite.displayHeight / 2;
    this.healthBar.fillStyle(0x33eeff, 1);
    this.healthBar.fillRect(-60, barYOffset, barWidth, 5);
  }

  public setDeath(): void { }
  public respawn(pos?: Vector): void { }
  public update(): void {
    if (!gameManager.phaserPlayer) return;
    if (gameManager.phaserPlayer.mesoCount < 15) {
      this.setVisible(false);
    } else {
      if (!this.visible) {
        const newXPos = getRandomInt(0, gameManager.gameWidth);
        this.x = newXPos;
        this.setVisible(true);
      }
    }
  }
}

export default EntityStar;
