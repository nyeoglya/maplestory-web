
import * as Phaser from 'phaser';

export class PhaserPlayer extends Phaser.Physics.Arcade.Sprite {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  public detectionZone: Phaser.Physics.Arcade.StaticBody | undefined; // 플레이어 주변 감지 영역

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(0.8, 0.8);
    this.setBounce(0);
    this.setCollideWorldBounds(true);

    this.cursors = this.scene.input.keyboard?.createCursorKeys() || null;
    
    // 충돌 존
    this.detectionZone = scene.physics.add.staticBody(this.x, this.y, 300, 300);

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

  update() {
    if (!this.cursors) {
      return;
    }

    const playerSpeed = 200;
    if (this.cursors.left.isDown) {
      this.setVelocityX(-playerSpeed);
      this.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(playerSpeed);
      this.anims.play('right', true);
    } else {
      this.setVelocityX(0);
      this.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.body instanceof Phaser.Physics.Arcade.Body && this.body.touching.down) {
      this.setVelocityY(-200);
    }

    if (this.detectionZone) {
      this.detectionZone.x = this.x;
      this.detectionZone.y = this.y;
    }
  }
}
