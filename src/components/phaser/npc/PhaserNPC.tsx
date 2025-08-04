import { v4 as uuidv4 } from 'uuid';
import * as Phaser from 'phaser';
import { Vector } from 'matter';
import Dialog from '@/utils/Dialog';

class NPC extends Phaser.GameObjects.Container {
  protected sprite: Phaser.GameObjects.Sprite;
  protected questVisible: boolean = false;

  public isInteracting: boolean = false;
  public pressStartTime: number = 0;
  public holdDuration: number = 0;

  // player가 interact 키를 이용해 상호작용했을 때, 발생할 것들
  public onInteractStart() {
    this.isInteracting = true;
    this.pressStartTime = this.scene.time.now;
  }

  // 상호작용 중에 발생할 것들
  public onInteracting() {
    this.holdDuration = this.scene.time.now - this.pressStartTime;
  }

  // player가 interact 키를 이용해 상호작용을 끝냈을 때, 발생할 것들
  public onInteractEnd() {
    this.isInteracting = false;
  }

  constructor(
    public scene: Phaser.Scene,
    protected currentPos: Vector,
    protected dialog: Dialog | null,
    public texture: string,
    public affectGravity: boolean = true,
    public name: string = '',
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
    body.setAllowGravity(affectGravity);
  }

  // 물리 객체 반환
  public getBody(): Phaser.Physics.Arcade.Body {
    return this.body as Phaser.Physics.Arcade.Body;
  }

  // 위치 반환
  public getCurrentPos() {
    return { x: this.x, y: this.y };
  }

  // update
  public update(time: number, delta: number): void {
    return;
  }

  // 개체 삭제
  public destroy(fromScene?: boolean): void {
    if (this.sprite) this.sprite.destroy();
    super.destroy(fromScene);
  }
}



export default NPC;
