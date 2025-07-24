import { PlayerStat } from '@/utils/interface';
import { v4 as uuidv4 } from 'uuid';
import Phaser from 'phaser';

class Entity extends Phaser.GameObjects.Container {
  private sprite: Phaser.GameObjects.Sprite;
  public currentHealth: number;
  private maxHealth: number;
  private healthBarBackground: Phaser.GameObjects.Graphics;
  private healthBar: Phaser.GameObjects.Graphics;

  public isDirectingLeft: boolean = true;

  // data와 collider로 공격을 시도한다. 성공할 경우, data를 수정한다. collider는 겹칠 경우에 데미지를 주는 적절한 collider를 선택
  public tryAttack(data: PlayerStat, collider: Phaser.Physics.Arcade.Sprite) {
    this.scene.physics.overlap(this.getBody(), collider, () => {
      data.health -= Math.min(20, data.health);
    }, undefined, this);
  }

  // entity에 데미지 입히기를 시도한다. collider는 겹칠 경우에 데미지를 입히는 적절한 collider를 선택
  public tryDamage(data: PlayerStat, collider: Phaser.Physics.Arcade.Sprite) {
    this.scene.physics.overlap(this.getBody(), collider, () => {
      this.currentHealth -= Math.min(20, this.currentHealth);
    }, undefined, this);
  }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    health: number,
    scale: number,
    public affectGravity: boolean = true,
    public isMove: boolean = true,
    public damage: number = 20,
    public speed: number = 20,
    public name: string = '',
    public uuid: string = uuidv4(),
  ) {
    super(scene, x, y);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.maxHealth = health;
    this.currentHealth = health;

    this.sprite = scene.add.sprite(0, 0, texture);
    this.sprite.setScale(scale, scale);
    this.add(this.sprite);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setSize(this.sprite.displayWidth, this.sprite.displayHeight);
    body.setOffset(-this.sprite.displayWidth / 2, -this.sprite.displayHeight / 2);

    // 체력 바
    const barYOffset = -this.sprite.displayHeight / 2 - 20;

    this.healthBarBackground = scene.add.graphics();
    this.healthBarBackground.fillStyle(0x333333, 0.8);
    this.healthBarBackground.fillRect(-30, barYOffset, 60, 10);
    this.add(this.healthBarBackground);

    this.healthBar = scene.add.graphics();
    this.healthBar.fillStyle(0x00ff00, 1);
    this.healthBar.fillRect(-30, barYOffset, 60, 10);
    this.add(this.healthBar);

    this.updateHealthBar(health);
  }

  // 물리 객체 반환
  public getBody(): Phaser.Physics.Arcade.Body {
    return this.body as Phaser.Physics.Arcade.Body;
  }

  // 속도 설정
  public setVelocityX(speed: number): void {
    const body = this.getBody();
    if (body) {
      body.setVelocityX(speed);
    }
  }

  // update
  public update(time: number, delta: number): void {
    if (this.x < 100) {
      this.setVelocityX(100);
    } else if (this.x > 700) {
      this.setVelocityX(-100);
    }
  }

  // 체력바 업데이트
  private updateHealthBar(currentHealth: number): void {
    this.currentHealth = currentHealth;
    this.healthBar.clear();

    if (this.currentHealth <= 0) {
      this.destroy();
      return;
    }

    const healthPercentage = this.currentHealth / this.maxHealth;
    const barWidth = 60 * healthPercentage;

    let barColor: number = 0x00ff00;
    if (healthPercentage < 0.5) {
      barColor = 0xffff00;
    }
    if (healthPercentage < 0.2) {
      barColor = 0xff0000;
    }

    const barYOffset = -this.sprite.displayHeight / 2 - 20;
    this.healthBar.fillStyle(barColor, 1);
    this.healthBar.fillRect(-30, barYOffset, barWidth, 10);
  }

  // 개체 삭제
  public destroy(fromScene?: boolean): void {
    if (this.healthBarBackground) {
      this.healthBarBackground.destroy();
    }
    if (this.healthBar) {
      this.healthBar.destroy();
    }
    if (this.sprite) {
      this.sprite.destroy();
    }
    super.destroy(fromScene);
  }
}

export default Entity;
