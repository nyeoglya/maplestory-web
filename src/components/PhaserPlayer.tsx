import * as Phaser from 'phaser';

export class PhaserPlayer extends Phaser.Physics.Arcade.Sprite {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  public detectionZone: Phaser.Physics.Arcade.StaticBody | undefined; // 플레이어 주변 감지 영역
  public directingLeft: boolean = true;
  private altKey: Phaser.Input.Keyboard.Key | null = null;
  private skillImg: Phaser.GameObjects.Image | undefined;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(0.8, 0.8);
    this.setBounce(0);
    this.setCollideWorldBounds(true);

    this.cursors = this.scene.input.keyboard?.createCursorKeys() || null;
    this.altKey = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ALT) || null;

    // 충돌 존
    this.detectionZone = scene.physics.add.staticBody(this.x, this.y, 300, 200);

    this.createAnimations();
  }

  private createAnimations() {
    this.scene.anims.create({
      key: 'left',
      frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1
    });
    this.scene.anims.create({
      key: 'turn',
      frames: [{ key: 'player', frame: 2 }],
      frameRate: 20
    });
    this.scene.anims.create({
      key: 'right',
      frames: this.scene.anims.generateFrameNumbers('player', { start: 3, end: 4 }),
      frameRate: 10,
      repeat: -1
    });
  }

  public showSkillImg(skillImgName: string = 'skillTestA') {
    if (this.skillImg && this.skillImg.active) return;

    if (this.detectionZone) {
      this.skillImg = this.scene.add.image(
        this.detectionZone.x,
        this.detectionZone.y,
        skillImgName
      ).setOrigin(0, 0);      
      this.skillImg.setFlipX(this.directingLeft);

      this.scene.time.delayedCall(500, () => {
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
      this.setVelocityX(-playerSpeed);
      this.anims.play('left', true);
      this.directingLeft = true;
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(playerSpeed);
      this.anims.play('right', true);
      this.directingLeft = false;
    } else {
      this.setVelocityX(0);
      if (this.directingLeft) {
        this.setFrame(0);
      } else {
        this.setFrame(4);
      }
      // this.anims.play('turn');
    }

    if (this.altKey && this.altKey.isDown && this.body instanceof Phaser.Physics.Arcade.Body && this.body.touching.down) {
      this.setVelocityY(-250);
    }

    if (this.detectionZone) {
      this.detectionZone.x = this.x - (this.directingLeft ? this.detectionZone.width : 0);
      this.detectionZone.y = this.y - this.detectionZone.height / 2;

      if (this.skillImg && this.skillImg.active) {
        this.skillImg.setPosition(this.detectionZone.x, this.detectionZone.y);
        this.skillImg.setFlipX(this.directingLeft);
      }
    }
  }
}
