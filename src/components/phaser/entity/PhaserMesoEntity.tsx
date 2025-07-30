import { v4 as uuidv4 } from 'uuid';
import * as Phaser from 'phaser';
import Entity from './PhaserEntity';
import { Vector } from 'matter';

class MesoEntity extends Entity {
  private static readonly ROTATE_ANIM_KEY = 'meso-rotate';
  protected sprite: Phaser.GameObjects.Sprite;

  constructor(
    public scene: Phaser.Scene,
    public pos: Vector,
    public texture: string = 'meso',
    public health: number = 1,
    public affectGravity: boolean = true,
    public isMove: boolean = false,
    public damage: number = 0,
    public xSpeed: number = 0,
    public name: string = 'meso',
    public healthBarVisible: boolean = false,
    public uuid: string = uuidv4(),
  ) {
    super(
      scene,
      pos.x,
      pos.y,
      texture,
      health,
      affectGravity,
      isMove,
      damage,
      xSpeed,
      name,
      healthBarVisible,
      uuid
    );

    // 컨테이너(자기 자신) (0,0)에 붙는 스프라이트 자식 추가
    this.sprite = scene.add.sprite(0, 0, texture);
    this.add(this.sprite); // Container에 부착 → 컨테이너 이동/회전에 따라 같이 움직임

    // 필요하다면 원점/스케일 조정
    // this.sprite.setOrigin(0.5, 0.5);

    // 물리 속도 설정 (Entity 쪽에서 제공하는 래퍼 사용 가정)
    this.setVelocityX(0);
    this.setVelocityY(-100);

    // 애니메이션 등록(중복 방지)
    this.ensureAnimations();

    // 스프라이트에서 애니메이션 재생
    this.sprite.anims.play(MesoEntity.ROTATE_ANIM_KEY, true);
  }

  private ensureAnimations(): void {
    if (!this.scene.anims.exists(MesoEntity.ROTATE_ANIM_KEY)) {
      this.scene.anims.create({
        key: MesoEntity.ROTATE_ANIM_KEY,
        frames: this.scene.anims.generateFrameNumbers(this.texture, { start: 0, end: 4 }),
        frameRate: 10,
        repeat: -1,
      });
    }
  }

  public update(): void {
    // 상태에 따라 다른 애니메이션 전환이 필요하면 여기서:
    // if (/* idle 상태 */) this.sprite.anims.play('meso-idle', true);
  }
}

export default MesoEntity;
