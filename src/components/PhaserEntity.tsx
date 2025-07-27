import { PlayerStat } from '@/utils/Utils';
import { v4 as uuidv4 } from 'uuid';
import * as Phaser from 'phaser';
import { Vector } from 'matter';

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
    if (this.death) return;
    this.scene.physics.overlap(this.getBody(), collider, () => {
      data.health -= Math.min(20, data.health);
    }, undefined, this);
  }

  // entity에 데미지를 입힌다.
  public async tryDamage(amount: number, repeat: number = 1) {
    if (this.death) return;

    const baseFontSize = 50;
    const yOffsetPerRepeat = baseFontSize * 0.7;

    this.currentHealth -= amount * repeat;
    this.updateHealthBar(this.currentHealth);
    
    for (let i = 0; i < repeat; i++) {
      const spawnY = this.y - (i * yOffsetPerRepeat);
      this.spawnDamageText(this.x, spawnY, amount.toString(), baseFontSize);
      if (this.currentHealth <= 0) {
        // this.destroy();
        this.setDeath();
      }
      await delay(100);
    }
  }

  public spawnDamageText(x: number, y: number, text: string, fontSize: number = 50, duration = 1000, riseHeight = 0) {
    if (this.death) return;
    this.isMove = false;
    const damageText = this.scene.add.text(x, y, text, {
      fontSize: `${fontSize}px`,
      stroke: '#000000',
      strokeThickness: 2,
      fontStyle: 'bold',
    });
  
    damageText.setOrigin(0.5, 1);
  
    this.scene.tweens.add({
      targets: damageText,
      y: y - riseHeight,
      alpha: { from: 1, to: 0 },
      duration: duration,
      ease: 'Power1',
      onComplete: () => {
        damageText.destroy();
        this.isMove = true;
      }
    });
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
    public xSpeed: number = 50,
    public name: string = '',
    public healthBarVisible: boolean = true,
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
    body.setAllowGravity(affectGravity);

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

    this.updateHealthBarVisibility(healthBarVisible);
    this.updateHealthBar(health);
    
    // 이동 설정 및 초기 속도
    this.setVelocityX(xSpeed);
    this.directingLeft = false;
    this.sprite.setFlipX(!this.directingLeft);
  }

  public updateHealthBarVisibility(value: boolean) {
    this.healthBarVisible = value;
    this.healthBar.setVisible(this.healthBarVisible);
    this.healthBarBackground.setVisible(this.healthBarVisible);
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

  public setVelocityY(speed: number): void {
    const body = this.getBody();
    if (body) {
      body.setVelocityY(speed);
    }
  }

  // update
  public update(time: number, delta: number): void {
    if (!this.isMove) {
      this.setVelocityX(0);
      return;
    }
    if (this.x < 100) {
      this.setVelocityX(this.xSpeed);
      this.directingLeft = false;
      this.sprite.setFlipX(!this.directingLeft);
    } else if (this.x > 700) {
      this.setVelocityX(-this.xSpeed);
      this.directingLeft = true;
      this.sprite.setFlipX(!this.directingLeft);
    }
  }

  // 체력바 업데이트
  private updateHealthBar(currentHealth: number): void {
    if (!this.healthBarVisible) return;
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
    this.setVisible(false);
  }

  public respawn() {
    this.death = false;
    this.currentHealth = this.maxHealth;
    this.x = this.initialPos.x;
    this.y = this.initialPos.y;
    this.setVisible(true);
    this.updateHealthBar(this.currentHealth);
  }

  // 개체 삭제
  public destroy(fromScene?: boolean): void {
    if (this.healthBarBackground) this.healthBarBackground.destroy();
    if (this.healthBar) this.healthBar.destroy();
    if (this.sprite) this.sprite.destroy();
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
      80,
    );
  };
}

export default Entity;
