import { v4 as uuidv4 } from 'uuid';
import * as Phaser from 'phaser';
import { Vector } from 'matter';
import { getRandomInt } from '@/utils/Utils';
import gameManager from '@/utils/manager/GameManager';
import { BuffStarForce, DebuffStarForce } from '@/utils/Effect';
import NPC from './PhaserNPC';
import Dialog from '@/utils/Dialog';

class NPCStar extends NPC {
  public bossTimeLeft: number = 30 * 60;

  public isShow: boolean = false;
  public effectProbability: number[] = [100, 90, 70, 50, 30, 20, 10, 5, 4, 3, 2, 1];

  protected gaugeBarBackground: Phaser.GameObjects.Graphics | null = null;
  protected gaugeBar: Phaser.GameObjects.Graphics | null = null;

  protected currentGauge: number = 0;
  protected maxGauge: number = 100;

  public onInteractStart() {
    this.isInteracting = true;
    this.pressStartTime = this.scene.time.now;
  }

  public onInteracting() {
    if (!this.visible) return;
    if (this.currentGauge >= this.maxGauge) this.tryStarForce();

    this.holdDuration = this.scene.time.now - this.pressStartTime;
    this.currentGauge = this.maxGauge * this.holdDuration / 3000;
    this.updateGaugeBar(this.currentGauge);
  }

  public onInteractEnd() {
    this.isInteracting = false;
    this.currentGauge = 0;
    this.updateGaugeBar(this.currentGauge);
  }

  public tryStarForce() {
    if (!gameManager.phaserPlayer) return;
    const randomNum = getRandomInt(1, 100);
    gameManager.phaserPlayer.mesoCount -= 15;
    if (randomNum <= this.effectProbability[gameManager.player.level]) {
      gameManager.player.level += 1;
      gameManager.effectManager.addEffect(BuffStarForce);
      gameManager.player.mainStat += 10;
    } else {
      gameManager.effectManager.addEffect(DebuffStarForce);
      gameManager.player.mainStat -= 5;
    }
    this.currentGauge = 0;
    this.updateGaugeBar(this.currentGauge);
    this.setVisible(false);
  }

  constructor(
    public scene: Phaser.Scene,
    public pos: Vector,
    public dialog: Dialog | null = null,
    public texture: string = 'starforce',
    public affectGravity: boolean = false,
    public name: string = 'starforce',
    public uuid: string = uuidv4(),
  ) {
    super(scene, pos, dialog, texture, affectGravity, name, uuid);
    this.createGaugeBar();
    this.nameText.setVisible(false);
    this.nameBackground.setVisible(false);
  }

  public createGaugeBar() {
    const barYOffset = -this.sprite.displayHeight / 2;

    this.gaugeBarBackground = this.scene.add.graphics();
    this.gaugeBarBackground.fillStyle(0x777777, 0.8);
    this.gaugeBarBackground.fillRect(-60, barYOffset, 120, 5);
    this.add(this.gaugeBarBackground);

    this.gaugeBar = this.scene.add.graphics();
    this.gaugeBar.fillStyle(0x33eeff, 1);
    this.gaugeBar.fillRect(-60, barYOffset, 120, 5);
    this.add(this.gaugeBar);

    this.updateGaugeBar(this.currentGauge);
  }

  protected updateGaugeBar(currentGage: number): void {
    if (!this.gaugeBar || !this.visible) return;
    this.currentGauge = currentGage;
    this.gaugeBar.clear();

    const gaugePercentage = this.currentGauge / this.maxGauge;
    const barWidth = 120 * gaugePercentage;

    const barYOffset = -this.sprite.displayHeight / 2;
    this.gaugeBar.fillStyle(0x33eeff, 1);
    this.gaugeBar.fillRect(-60, barYOffset, barWidth, 5);
  }

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

export default NPCStar;
