import { v4 as uuidv4 } from 'uuid';
import * as Phaser from 'phaser';
import { Vector } from 'matter';
import Dialog from '@/utils/Dialog';
import gameManager from '@/utils/manager/GameManager';

class NPC extends Phaser.GameObjects.Container {
  protected sprite: Phaser.GameObjects.Sprite;
  protected nameText: Phaser.GameObjects.Text;
  protected nameBackground: Phaser.GameObjects.Graphics;
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

  // 클릭 상호작용의 발생
  public onClickInteract(pointer: Phaser.Input.Pointer) { }

  // 대화 시작
  public dialogStart() {
    if (!gameManager.setCurrentDialog || !this.dialog) return;
    this.dialog.resetDialog();
    gameManager.setCurrentDialog(this.dialog);
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

    // 이름 텍스트 생성
    this.nameText = scene.add.text(0, -this.sprite.height / 2 - 6, name, {
      fontSize: '10px',
      color: '#ffffff',
      fontFamily: 'Arial',
      padding: { x: 2, y: 1 }, // 텍스트 내부 여백
    }).setOrigin(0.5, 1);

    this.nameBackground = scene.add.graphics();
    this.updateNameBackground();

    this.add(this.nameBackground);
    this.add(this.nameText);

    this.sprite.setInteractive();
    this.sprite.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.onClickInteract(pointer);
    });

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

  // 이름 배경 업데이트
  private updateNameBackground() {
    this.nameBackground.clear();
    const padding = 1;

    const width = this.nameText.width + padding * 2;
    const height = this.nameText.height + padding * 2;

    // 배경 사각형 그리기
    this.nameBackground.fillStyle(0x000000, 0.6); // 검정, 60% 불투명
    this.nameBackground.fillRoundedRect(
      -width / 2,
      -this.sprite.height / 2 - this.nameText.height - padding - 6,
      width,
      height,
      4
    );
  }

  // update
  public update(time: number, delta: number): void {
    return;
  }

  // 개체 삭제
  public destroy(fromScene?: boolean): void {
    if (this.sprite) this.sprite.destroy();
    if (this.nameText) this.nameText.destroy();
    if (this.nameBackground) this.nameBackground.destroy();
    super.destroy(fromScene);
  }
}



export default NPC;
