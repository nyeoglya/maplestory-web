"use client";
import { PlayerStat } from '@/utils/PlayerStat';

import { Vector } from 'matter';

class Entity {
  private container: any;
  private sprite: any;
  public currentHealth: number;
  private maxHealth: number;
  private healthBarBackground: any;
  private healthBar: any;

  private initialPos: Vector;
  public death: boolean = false;
  public isDirectingLeft: boolean = true;
  public uuid: string = '';

  // data와 collider로 공격을 시도한다. 성공할 경우, data를 수정한다. collider는 겹칠 경우에 데미지를 주는 적절한 collider를 선택
  public tryAttack(data: PlayerStat, collider: any) {
    this.scene.physics.overlap(this.getBody(), collider, () => {
      data.health -= Math.min(20, data.health);
    }, undefined, this);
  }

  // entity에 데미지 입히기를 시도한다. collider는 겹칠 경우에 데미지를 입히는 적절한 collider를 선택
  public tryDamage(amount: number) {
    this.currentHealth -= amount;
    if (this.currentHealth <= 0) {
      // this.destroy();
      this.setDeath();
    }
  }

  constructor(
    Phaser: any,
    public scene: any,
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
  ) {
    this.container = new Phaser.GameObjects.Container(scene, x, y);
    this.initialPos = {x: x, y: y};

    if (typeof window !== 'undefined') {
      import('uuid').then(({ v4: uuidv4 }) => {
        this.uuid = uuidv4();
      });
    } else {
      this.uuid = 'server-side-uuid-' + Math.random().toString(36).substring(2, 15);
    }

    scene.add.existing(this.container);
    scene.physics.add.existing(this.container);
    

    this.maxHealth = health;
    this.currentHealth = health;

    this.sprite = new Phaser.GameObjects.Sprite(scene, 0, 0, texture);
    this.sprite.setScale(scale, scale);
    this.container.add(this.sprite);

    const body = this.container.body as any;
    body.setCollideWorldBounds(true);
    body.setSize(this.sprite.displayWidth, this.sprite.displayHeight);
    body.setOffset(-this.sprite.displayWidth / 2, -this.sprite.displayHeight / 2);

    // 체력 바
    const barYOffset = -this.sprite.displayHeight / 2 - 20;

    this.healthBarBackground = new Phaser.GameObjects.Graphics(scene);
    this.healthBarBackground.fillStyle(0x333333, 0.8);
    this.healthBarBackground.fillRect(-30, barYOffset, 60, 10);
    this.container.add(this.healthBarBackground);

    this.healthBar = new Phaser.GameObjects.Graphics(scene);
    this.healthBar.fillStyle(0x00ff00, 1);
    this.healthBar.fillRect(-30, barYOffset, 60, 10);
    this.container.add(this.healthBar);

    this.updateHealthBar(health);
  }

  // 물리 객체 반환
  public getBody(): any {
    return this.container.body as any;
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
    if (this.container.x < 100) {
      this.setVelocityX(100);
    } else if (this.container.x > 700) {
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
    this.container.destroy(fromScene);
  }
}

export class TestEntityA extends Entity {
  constructor(
    Phaser: any,
    scene: any,
    pos: Vector,
  ) {
    super(
      Phaser,
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
