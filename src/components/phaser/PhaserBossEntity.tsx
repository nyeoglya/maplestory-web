import { v4 as uuidv4 } from 'uuid';
import * as Phaser from 'phaser';
import Entity from './PhaserEntity';
import { Vector } from 'matter';
import gameManager from '@/utils/manager/GameManager';
import { getRandomInt } from '@/utils/Utils';
import EntityBossHandTarget from './PhaserBossHandTargetEntity';
import EntityBossHand from './PhaserBossHandEntity';

enum BossPhaseStatus {
  CHICKEN,
  BR,
  PIZZA
};

enum BossDefaultStatus {
  FLY, // 날고 있음. 이때는 플레이어 위에 떠있음.
  GROUND, // 위치를 정하고 잠시 기다렸다가 활강. 중력을 받게 하면 됨.
  RETURN // 다시 되돌아감.
};

interface BossConfig {
  scene: Phaser.Scene;
  pos: { x: number; y: number };
  texture?: string;
  health?: number;
  scale?: number;
  affectGravity?: boolean;
  isMove?: boolean;
  damage?: number;
  speed?: number;
  name?: string;
  floorY?: number;
  healthBarVisible?: boolean;
  uuid?: string;
}

class BossEntity extends Entity {
  public bossTimeLeft: number = 30 * 60;

  public currentStatus: BossPhaseStatus = BossPhaseStatus.CHICKEN;
  public defaultStatus: BossDefaultStatus = BossDefaultStatus.FLY;
  public chickenCount: number = 0;
  protected bossHandTarget: EntityBossHandTarget | null = null;

  public bossEvent() {
    console.log('보스 이벤트 발생!!!');
    this.phaseDefault();
    // TODO: Phase calculation
    this.phaseChicken();
  }

  /*
  2. 페이즈 사이클
  피자, 베라, 치킨의 사이클로 페이즈가 돌아가며, 시간 비중은 각각 1분, 1분, 30초.

  3. 스타포스
  획득한 메소를 사용하여 시도 가능, 맵에 별 모양의 오브젝트가 나타나면 NPC/채집 키를 이용하여 강화 시도 가능. -> 새로 구현해야 함.
  
  성공 시 10초 간 최종 데미지 20% 증가, 공격력 +10 영구 증가. -> 버프 형태
  실패 시 3초 간 Player 행동 불능  및 공격력 -5. -> 버프 형태

  성공 확률은 누적된 성공 횟수에 따라 100 / 90 / 70 / 50 / 30 / 20 / 10 / 5 / 4 / 3 / 2 / 1 로 나뉨  -> 버프 형태
  */

  constructor({
    scene,
    pos,
    texture = 'boss',
    health = 2000,
    scale = 0.3,
    affectGravity = true,
    isMove = true,
    damage = 200,
    speed = 0,
    floorY = 0,
    name = '',
    healthBarVisible = false,
    uuid = uuidv4(),
  }: BossConfig) {
    super(scene, pos.x, pos.y, texture, health, scale, affectGravity, isMove, damage, speed, name, healthBarVisible, uuid);

    const newBossHand = new EntityBossHand(scene, { x: pos.x, y: 0 });
    this.bossHandTarget = new EntityBossHandTarget(newBossHand, scene, { x: pos.x, y: floorY });
    newBossHand.setDeath();
    this.bossHandTarget.setDeath();

    this.scene.time.addEvent({
      delay: 5000,
      callback: this.bossEvent,
      callbackScope: this,
      loop: true
    });
  }

  /*
  Phase 치킨
  보스 몹은 phase가 끝날 때까지 위치 고정된 채로 존재.
  맵에 닭이 뛰노는 곳 몹인 갈리나/갈루스가 소환됨.
  소환된 몹은 보스 몹에게 점차 끌려가게 되며, 보스 몹과 닿으면 소멸됨, 이 방식으로 소멸된 닭이 10마리를 기록하는 경우, Phase가 끝나면서 획득한 메소 1억 당 데스카운트 1개를 회수해 감
  */
  public phaseChicken() {

  }

  /*
  맵 상단부에서 베스X라X스 아이스크림이 떨어짐.
  맛(flavor)에 따라서 Player 피격 시 디버프 효과를 받게 됨.

  민트초코 - 1초 간 행동 불능 상태.
  엄준식은 외계인 - 상하좌우 구분 변경.
  녹차 - 받는 데미지 10% 증가.
  */
  public phaseBR() {
    // TODO: 초기 위치를 랜덤하게 재설정.
    gameManager.floatingEntityManager.respawnEntities();
  }

  /*
  "제가 좋아하는 불벅 피자입니다" 보이스 출력
  피자 모양 검기를 발사, 피격 시 거짓말 탐지기가 발동됨. (불법이라서)
  제시어는 “원기어미원숭이”, “니어미원숭이” 
  */
  public phasePizza() {

  }

  /*
  잡몹 소환술 -> 15초에 한 번씩 ‘약화된 클리너’를 n마리 소환함
  원기의 기본 공격 -> 위에서 낙하하면서 떨어짐
  */
  public phaseDefault() {
    gameManager.normalEntityManager.respawnEntities();
    const randomX = getRandomInt(0, 1000);
    this.bossHandTarget?.startTargeting(randomX);
  }

  public introScene() {

  }

  public deathScene() {

  }

  public update(): void {
    if (!this.bossHandTarget) return;
    this.bossHandTarget.update();
  }
}

export default BossEntity;
