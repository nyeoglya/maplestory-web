import gameManager from '@/utils/GameManager';
import * as Phaser from 'phaser';

export class PhaserPlayer extends Phaser.Physics.Arcade.Sprite {
  public detectionZone: Phaser.Physics.Arcade.StaticBody | undefined; // 플레이어 주변 감지 영역
  public directingLeft: boolean = true;
  private jumpKey: Phaser.Input.Keyboard.Key | null = null;
  private leftKey: Phaser.Input.Keyboard.Key | null = null;
  private rightKey: Phaser.Input.Keyboard.Key | null = null;
  private upKey: Phaser.Input.Keyboard.Key | null = null;
  private downKey: Phaser.Input.Keyboard.Key | null = null;
  private skillImg: Phaser.GameObjects.Image | undefined;
  
  private doubleClickCriteria = 300;
  private doubleClickJumpTime: number = this.scene.time.now;
  private disableJump: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(0.8, 0.8);
    this.setBounce(0);
    this.setCollideWorldBounds(true);
    this.setDragX(500);

    this.jumpKey = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ALT) || null;
    this.leftKey = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT) || null;
    this.rightKey = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT) || null;
    this.downKey = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN) || null;
    this.upKey = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.UP) || null;

    this.scene.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      if (event.altKey && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.code)) {
        event.preventDefault();
      }
    });

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

  public disablePlatform: (() => void) | null = null;
  public teleportLoc: string | null = null;

  update() {
    if (!this.leftKey || !this.rightKey || !this.downKey || !this.upKey || !this.jumpKey) return;
    const playerSpeed: number = gameManager.player.speed.x;
    const isBodyTouchingDown: boolean = this.body?.touching.down || false;
    if (!this.disableJump) {
      if (this.leftKey.isDown) {
        this.setVelocityX(-playerSpeed * (isBodyTouchingDown ? 1 : 0.8));
        this.anims.play('left', true);
        this.directingLeft = true;
      } else if (this.rightKey.isDown) {
        this.setVelocityX(playerSpeed * (isBodyTouchingDown ? 1 : 0.8));
        this.anims.play('right', true);
        this.directingLeft = false;
      } else if (isBodyTouchingDown) {
        this.setVelocityX(0);
        if (this.directingLeft) {
          this.setFrame(0);
        } else {
          this.setFrame(4);
        }
        // this.anims.play('turn');
      }
    }

    if (isBodyTouchingDown) {
      this.disableJump = false;
    }

    if (Phaser.Input.Keyboard.JustDown(this.jumpKey) && this.body instanceof Phaser.Physics.Arcade.Body) {
      if (this.downKey?.isDown && this.disablePlatform && this.body.touching.down) {
        this.disablePlatform();
      } else {
        if (this.disableJump) return;

        const now = this.scene.time.now;

        if (now - this.doubleClickJumpTime < this.doubleClickCriteria) {
          this.disableJump = true;
          this.setVelocityY(-300);
          this.setVelocityX(700 * (this.directingLeft ? -1 : 1));
        } else {
          if (this.body.touching.down) {
            this.setVelocityY(-250);
          }
        }
        this.doubleClickJumpTime = now;
      }
    }

    if (this.upKey.isDown && this.body instanceof Phaser.Physics.Arcade.Body && this.body.touching.down) {
      if (!this.teleportLoc) return;
      this.scene.scene.start(this.teleportLoc);
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
