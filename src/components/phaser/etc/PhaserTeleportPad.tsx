import { v4 as uuidv4 } from 'uuid';
import * as Phaser from 'phaser';
import { Vector } from 'matter';

class TeleportPad extends Phaser.GameObjects.Container {
  protected sprite: Phaser.GameObjects.Sprite;

  constructor(
    public scene: Phaser.Scene,
    protected currentPos: Vector,
    public teleportLoc: string,
    public texture: string = 'teleportpad',
    public uuid: string = uuidv4(),
  ) {
    super(scene, currentPos.x, currentPos.y);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.sprite = scene.add.sprite(0, 0, texture);
    this.add(this.sprite);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setSize(this.sprite.displayWidth, this.sprite.displayHeight);
    body.setOffset(-this.sprite.displayWidth / 2, -this.sprite.displayHeight / 2);
    body.setAllowGravity(false);
  }

  // 물리 객체 반환
  public getBody(): Phaser.Physics.Arcade.Body {
    return this.body as Phaser.Physics.Arcade.Body;
  }

  // 개체 삭제
  public destroy(fromScene?: boolean): void {
    if (this.sprite) this.sprite.destroy();
    super.destroy(fromScene);
  }
}

export default TeleportPad;
