import gameManager from '@/utils/manager/GameManager';
import * as Phaser from 'phaser';
import Entity from './entity/PhaserEntity';
import { getRandomInt } from '@/utils/Utils';

class PhaserPlayer extends Phaser.Physics.Arcade.Sprite {
  public detectionZone: Phaser.Physics.Arcade.StaticBody | undefined; // 플레이어 주변 감지 영역
  public directingLeft: boolean = true;
  protected jumpKey: Phaser.Input.Keyboard.Key | null = null;
  protected leftKey: Phaser.Input.Keyboard.Key | null = null;
  protected rightKey: Phaser.Input.Keyboard.Key | null = null;
  protected upKey: Phaser.Input.Keyboard.Key | null = null;
  protected downKey: Phaser.Input.Keyboard.Key | null = null;
  protected retrieveKey: Phaser.Input.Keyboard.Key | null = null;
  protected interactKey: Phaser.Input.Keyboard.Key | null = null;
  protected skillImg: Phaser.GameObjects.Image | undefined;

  protected doubleClickCriteria = 300;
  protected doubleClickJumpTime: number = this.scene.time.now;
  protected disableJump: boolean = false;
  public mesoCount: number = 0;

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
    this.retrieveKey = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.Z) || null;
    this.interactKey = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE) || null;

    this.scene.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      if (event.altKey && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.code)) {
        event.preventDefault();
      }
    });

    if (gameManager.starEntity) {
      this.interactKey?.on('down', () => {
        if (!gameManager.starEntity) return;
        gameManager.starEntity.pressStartTime = this.scene.time.now;
      });

      this.interactKey?.on('up', () => {
        if (!gameManager.starEntity) return;
        gameManager.starEntity.pressStartTime = null;
        gameManager.starEntity.resetPressTime();
      });
    }

    // 충돌 존
    this.detectionZone = scene.physics.add.staticBody(this.x, this.y, 300, 200);

    this.createAnimations();
  }

  public setDeath() {
    gameManager.deathCount -= 1;
    this.x = getRandomInt(50, gameManager.gameWidth - 50);
    this.y = gameManager.gameHeight - 200;
    gameManager.player.health = gameManager.player.maxHealth;
    gameManager.player.mana = gameManager.player.maxMana;
    gameManager.effectManager.clearEffect();
  }

  public getCurrentPos() {
    return { x: this.x, y: this.y };
  }

  public getMeso() {
    const playerPos = gameManager.phaserPlayer?.getBottomCenter();
    if (!playerPos) return;

    gameManager.droppedItems = gameManager.droppedItems.filter((drop: Entity) => {
      const dx = drop.x - playerPos.x;
      const dy = drop.y - playerPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 50) {
        drop.destroy();
        this.mesoCount += 1;
        return false;
      } else {
        return true;
      }
    });
  }

  public createAnimations() {
    this.scene.anims.create({
      key: 'left',
      frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1
    });
    this.scene.anims.create({
      key: 'right',
      frames: this.scene.anims.generateFrameNumbers('player', { start: 3, end: 5 }),
      frameRate: 10,
      repeat: -1
    });
  }

  public showSkillImg(skillImgName: string | undefined) {
    if (this.skillImg && this.skillImg.active || !skillImgName) return;

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
    if (!this.leftKey || !this.rightKey || !this.downKey || !this.upKey || !this.jumpKey || !this.retrieveKey || !this.interactKey) return;
    if (!gameManager.player.isMove) {
      this.anims.stop();
      return;
    }

    if (this.interactKey.isDown && gameManager.starEntity && gameManager.starEntity.pressStartTime) {
      const now = this.scene.time.now;
      gameManager.starEntity.holdingDuration = (now - gameManager.starEntity.pressStartTime) / 1000;
      gameManager.starEntity.increaseStarLevel();
    }

    const playerSpeed: number = gameManager.player.speed.x;
    const isBodyTouchingDown: boolean = this.body?.touching.down || false;
    const flipDirection: number = gameManager.player.flipKey ? -1 : 1;
    if (!this.disableJump) {
      if (this.leftKey.isDown) {
        this.setVelocityX(-playerSpeed * (isBodyTouchingDown ? 1 : 0.8) * flipDirection);
        this.anims.play('left', true);
        this.directingLeft = true;
      } else if (this.rightKey.isDown) {
        this.setVelocityX(playerSpeed * (isBodyTouchingDown ? 1 : 0.8) * flipDirection);
        this.anims.play('right', true);
        this.directingLeft = false;
      } else if (isBodyTouchingDown) {
        this.setVelocityX(0);
        if (this.directingLeft) {
          this.setFrame(2);
        } else {
          this.setFrame(3);
        }
        // this.anims.play('turn');
      }
    }

    if (this.retrieveKey.isDown) this.getMeso();

    if (isBodyTouchingDown) this.disableJump = false;

    if (Phaser.Input.Keyboard.JustDown(this.jumpKey) && this.body instanceof Phaser.Physics.Arcade.Body) {
      if (this.downKey?.isDown && this.disablePlatform && this.body.touching.down) {
        this.disablePlatform();
      } else {
        if (this.disableJump) return;

        const now = this.scene.time.now;

        if (now - this.doubleClickJumpTime < this.doubleClickCriteria) {
          this.disableJump = true;
          this.setVelocityY(-300);
          this.setVelocityX(700 * (this.directingLeft ? -1 : 1) * flipDirection);
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

export default PhaserPlayer;
