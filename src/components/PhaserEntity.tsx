import { PlayerStat } from '@/utils/PlayerStat';
import { v4 as uuidv4 } from 'uuid';
import * as Phaser from 'phaser';
import { Vector } from 'matter';

class Entity extends Phaser.GameObjects.Container {
  private sprite: Phaser.GameObjects.Sprite;
  public currentHealth: number;
  private maxHealth: number;
  private healthBarBackground: Phaser.GameObjects.Graphics;
  private healthBar: Phaser.GameObjects.Graphics;

  private initialPos: Vector;
  public death: boolean = false;
  public directingLeft: boolean = true;

  // data와 collider로 공격을 시도한다. 성공할 경우, data를 수정한다. collider는 겹칠 경우에 데미지를 주는 적절한 collider를 선택
  public tryAttack(data: PlayerStat, collider: Phaser.Physics.Arcade.Sprite) {
    this.scene.physics.overlap(this.getBody(), collider, () => {
      data.health -= Math.min(20, data.health);
    }, undefined, this);
  }

  // entity에 데미지 입히기를 시도한다. collider는 겹칠 경우에 데미지를 입히는 적절한 collider를 선택
  public tryDamage(amount: number) {
    this.currentHealth -= amount;
    this.updateHealthBar(this.currentHealth);
    if (this.currentHealth <= 0) {
      // this.destroy();
      this.setDeath();
    }
  }

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
    public speed: number = 20,
    public name: string = '',
    public uuid: string = uuidv4(),
  ) {
    super(scene, x, y);
    this.initialPos = {x: x, y: y};

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
    this.healthBarBackground.fillStyle(0x777777, 0.8);
    this.healthBarBackground.fillRect(-30, barYOffset, 60, 5);
    this.add(this.healthBarBackground);

    this.healthBar = scene.add.graphics();
    this.healthBar.fillStyle(0x00ff00, 1);
    this.healthBar.fillRect(-30, barYOffset, 60, 5);
    this.add(this.healthBar);

    this.setVelocityX(100);
    this.directingLeft = false;
    this.sprite.setFlipX(!this.directingLeft);

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
      this.directingLeft = false;
      this.sprite.setFlipX(!this.directingLeft);
    } else if (this.x > 700) {
      this.setVelocityX(-100);
      this.directingLeft = true;
      this.sprite.setFlipX(!this.directingLeft);
    }
  }

  // 체력바 업데이트
  private updateHealthBar(currentHealth: number): void {
    this.currentHealth = currentHealth;
    this.healthBar.clear();

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
    this.healthBar.fillRect(-30, barYOffset, barWidth, 5);
  }

  public setDeath() {
    this.death = true;
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

export class TestEntityA extends Entity {
  constructor(
    scene: Phaser.Scene,
    pos: Vector,
  ) {
    super(
      scene,
      pos.x,
      pos.y,
      'boss',
      200,
      0.3,
      true,
      true,
      20,
      20,
    );
  };
}

export default Entity;
