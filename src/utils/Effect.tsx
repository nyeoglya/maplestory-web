import gameManager from "./manager/GameManager";
import { PlayerStat } from "./Utils";

export abstract class Effect {
  constructor(
    public name: string,
    public description: string,
    public duration: number,
    public effectIconPath: string = '',
  ) { }

  // 실제 효과
  public effect(effectedData: PlayerStat) { }

  // 효과가 시작할 때/끝냈을 때
  public startEffect() { }
  public endEffect() { }
}

// 버프
export class BuffEffect extends Effect {
  constructor() {
    super(
      '버프',
      '공격력이 강화됩니다.',
      5,
      '/assets/effect.png'
    );
  }

  public effect(data: PlayerStat) {
    data.mainStat += 20;
  }
}

// 디버프
export class DebuffMint extends Effect {
  constructor() {
    super(
      '민트맛 베라',
      '행동불능이 됩니다.',
      2,
      '/assets/brmint.png'
    );
  }

  public startEffect(): void {
    gameManager.player.isMove = false;
  }

  public endEffect() {
    gameManager.player.isMove = true;
  }
}

export class DebuffEum extends Effect {
  constructor() {
    super(
      '엄준식은 외계인',
      '좌우가 뒤바뀝니다.',
      5,
      '/assets/breum.png'
    );
  }

  public startEffect(): void {
    gameManager.player.flipKey = true;
  }

  public endEffect() {
    gameManager.player.flipKey = false;
  }
}

export class DebuffGreenTea extends Effect {
  constructor() {
    super(
      '녹차맛 베라',
      '받는 데미지가 10% 증가합니다.',
      20,
      '/assets/brgreentea.png'
    );
  }

  public startEffect(): void {
    gameManager.player.damageMultiplier += 0.1;
  }

  public endEffect() {
    gameManager.player.damageMultiplier -= 0.1;
  }
}

export class DebuffStarForce extends Effect {
  constructor() {
    super(
      '스타포스 실패',
      '행동 불능에 걸립니다.',
      3,
      '/assets/starforce.png'
    );
  }

  public startEffect(): void {
    gameManager.player.isMove = false;
  }

  public endEffect() {
    gameManager.player.isMove = true;
  }
}

export class BuffStarForce extends Effect {
  constructor() {
    super(
      '스타포스 성공',
      '주는 데미지가 100% 증가합니다.',
      30,
      '/assets/starforce.png'
    );
  }

  public startEffect(): void {
    gameManager.player.damageMultiplier += 1.0;
  }

  public endEffect() {
    gameManager.player.damageMultiplier -= 1.0;
  }
}

export class DebuffCaptcha extends Effect {
  constructor() {
    super(
      '거짓말 탐지기 실패',
      '5초간 이동이 불가능합니다.',
      5,
      '/assets/liedetector.png'
    );
  }

  public startEffect(): void {
    gameManager.player.isMove = false;
  }

  public endEffect() {
    gameManager.player.isMove = true;
  }
}

