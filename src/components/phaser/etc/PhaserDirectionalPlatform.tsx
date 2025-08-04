import { v4 as uuidv4 } from 'uuid';
import * as Phaser from 'phaser';
import { Vector } from 'matter';
import PhaserPlayer from '../PhaserPlayer';

class DirectionalPlatform extends Phaser.GameObjects.Container {
  protected sprite: Phaser.GameObjects.Sprite;
  protected platform: Phaser.Physics.Arcade.Sprite;
  protected collider: Phaser.Physics.Arcade.Collider;

  constructor(
    public scene: Phaser.Scene,
    protected currentPos: Vector,
    public player: PhaserPlayer,
    public texture: string | null = null,
    public scaleWidth: number = 1,
    public uuid: string = uuidv4(),
  ) {
    super(scene, currentPos.x, currentPos.y);
    scene.add.existing(this);

    // 시각용 sprite
    this.sprite = scene.add.sprite(0, 0, texture || 'default_pixel');
    this.add(this.sprite);

    // 충돌 플랫폼
    this.platform = scene.physics.add.staticSprite(currentPos.x, currentPos.y, 'default_pixel')
      .setOrigin(0, 0)
      .setScale(scaleWidth, 1)
      .refreshBody();

    // 충돌 조건: 아래서 위로 뚫고 올라오면 통과, 위에서 아래로는 충돌
    this.collider = scene.physics.add.collider(
      this.player,
      this.platform,
      undefined,
      (playerObj, platformObj) => {
        if (!("body" in playerObj) || !("body" in platformObj)) return false;
        const player = playerObj as Phaser.Physics.Arcade.Sprite;
        const platform = platformObj as Phaser.Physics.Arcade.Sprite;
        if (!player.body || !platform.body) return;
        const falling = player.body.velocity.y > 0;
        const isAbove = player.body.bottom <= platform.body.top + player.body.velocity.y * this.scene.game.loop.delta / 1000 + 2;
        return falling && isAbove;
      },
      this
    );
  }

  public temporarilyDisableCollision() {
    this.collider.active = false;
    this.scene.time.delayedCall(300, () => {
      this.collider.active = true;
    });
  }

  public isPlayerOnTop(): boolean {
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    const platformBody = this.platform.body as Phaser.Physics.Arcade.Body;
    if (!playerBody || !platformBody) return false;
    const isHorizontallyOverlap = playerBody.right > platformBody.left && playerBody.left < platformBody.right;
    const isAbove = playerBody.bottom <= platformBody.top + 2 && playerBody.bottom >= platformBody.top - 2;
    return isHorizontallyOverlap && isAbove;
  }

  public destroy(fromScene?: boolean): void {
    this.sprite?.destroy();
    this.platform?.destroy();
    this.collider?.destroy();
    super.destroy(fromScene);
  }
}


export default DirectionalPlatform;
