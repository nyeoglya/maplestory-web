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
export class EffectTestA extends Effect {
  constructor() {
    super(
      '효과 테스트 A',
      '테스트용 효과A 입니다.',
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
    gameManager.player.debuffDamageMultiplier += 0.1;
  }

  public endEffect() {
    gameManager.player.debuffDamageMultiplier -= 0.1;
  }
}
