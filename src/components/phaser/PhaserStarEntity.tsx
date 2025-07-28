import { v4 as uuidv4 } from 'uuid';
import * as Phaser from 'phaser';
import Entity from './PhaserEntity';
import { Vector } from 'matter';
import { getRandomInt } from '@/utils/Utils';

class EntityStar extends Entity {
  public bossTimeLeft: number = 30 * 60;

  public isShow: boolean = false;
  public effectProbability: number[] = [100, 90, 70, 50, 30, 20, 10, 5, 4, 3, 2, 1];
  public effectStack: number = 0;

  constructor(
    public scene: Phaser.Scene,
    public pos: Vector,
    public texture: string = 'star',
    public health: number = 1,
    public scale: number = 1,
    public affectGravity: boolean = false,
    public isMove: boolean = false,
    public damage: number = 0,
    public speed: number = 0,
    public name: string = 'star',
    public healthBarVisible: boolean = false,
    public uuid: string = uuidv4(),
  ) {
    super(scene, pos.x, pos.y, texture, health, scale, affectGravity, isMove, damage, speed, name, healthBarVisible, uuid);
  }

  /*
  3. 스타포스
  획득한 메소를 사용하여 시도 가능, 맵에 별 모양의 오브젝트가 나타나면 NPC/채집 키를 이용하여 강화 시도 가능.
  
  성공 시 10초 간 최종 데미지 20% 증가, 공격력 +10 영구 증가. -> 버프 형태
  실패 시 3초 간 Player 행동 불능  및 공격력 -5. -> 버프 형태

  성공 확률은 누적된 성공 횟수에 따라 100 / 90 / 70 / 50 / 30 / 20 / 10 / 5 / 4 / 3 / 2 / 1 로 나뉨  -> 버프 형태
  */

  // 랜덤 가챠 시작
  public rollDie() {
    const randomNum = getRandomInt(1, 100);

  }

  public update(): void { }
}

export default EntityStar;
