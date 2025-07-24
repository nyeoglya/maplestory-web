
"use client";

export class PhaserPlayer {
  private sprite: any;
  private cursors: any | null = null;
  public detectionZone: any | undefined; // 플레이어 주변 감지 영역
  public directingLeft: boolean = true;
  private altKey: any | null = null;
  private skillImg: any | undefined;
  private Phaser: any;

  constructor(Phaser: any, scene: any, x: number, y: number, texture: string, frame?: string | number) {
    this.Phaser = Phaser;
    this.sprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, texture, frame);

    scene.add.existing(this.sprite);
    scene.physics.add.existing(this.sprite);

    this.sprite.setScale(0.8, 0.8);
    this.sprite.setBounce(0);
    this.sprite.setCollideWorldBounds(true);

    this.cursors = this.sprite.scene.input.keyboard?.createCursorKeys() || null;
    this.altKey = this.sprite.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ALT) || null;

    // 충돌 존
    this.detectionZone = scene.physics.add.staticBody(this.sprite.x, this.sprite.y, 300, 200);

    this.createAnimations();
  }

  private createAnimations() {
    this.sprite.scene.anims.create({
      key: 'left',
      frames: this.sprite.scene.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1
    });
    this.sprite.scene.anims.create({
      key: 'turn',
      frames: [{ key: 'player', frame: 2 }],
      frameRate: 20
    });
    this.sprite.scene.anims.create({
      key: 'right',
      frames: this.sprite.scene.anims.generateFrameNumbers('player', { start: 3, end: 4 }),
      frameRate: 10,
      repeat: -1
    });
  }

  public showSkillImg(skillImgName: string = 'skillTestA') {
    if (this.skillImg && this.skillImg.active) return;

    if (this.detectionZone) {
      this.skillImg = this.sprite.scene.add.image(
        this.detectionZone.x,
        this.detectionZone.y,
        skillImgName
      ).setOrigin(0, 0);      
      this.skillImg.setFlipX(this.directingLeft);

      this.sprite.scene.time.delayedCall(500, () => {
        if (this.skillImg) {
          this.skillImg.destroy();
          this.skillImg = undefined;
        }
      }, [], this);
    }
  }

  update() {
    if (!this.cursors) {
      return;
    }

    const playerSpeed = 200;
    if (this.cursors.left.isDown) {
      this.sprite.setVelocityX(-playerSpeed);
      this.sprite.anims.play('left', true);
      this.directingLeft = true;
    } else if (this.cursors.right.isDown) {
      this.sprite.setVelocityX(playerSpeed);
      this.sprite.anims.play('right', true);
      this.directingLeft = false;
    } else {
      this.sprite.setVelocityX(0);
      if (this.directingLeft) {
        this.sprite.setFrame(0);
      } else {
        this.sprite.setFrame(4);
      }
      // this.anims.play('turn');
    }

    if (this.altKey && this.altKey.isDown && this.sprite.body instanceof this.Phaser.Physics.Arcade.Body && this.sprite.body.touching.down) {
      this.sprite.setVelocityY(-200);
    }

    if (this.detectionZone) {
      this.detectionZone.x = this.sprite.x - (this.directingLeft ? this.detectionZone.width : 0);
      this.detectionZone.y = this.sprite.y - this.detectionZone.height / 2;

      if (this.skillImg && this.skillImg.active) {
        this.skillImg.setPosition(this.detectionZone.x, this.detectionZone.y);
        this.skillImg.setFlipX(this.directingLeft);
      }
    }
  }
}
