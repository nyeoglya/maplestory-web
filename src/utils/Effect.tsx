import {PlayerStat} from "./Utils";

export abstract class Effect {
  constructor(
    public name: string,
    public description: string,
    public duration: number,
    public effectIconPath: string = '',
  ) {}

  // 실제 효과
  public effect(data: PlayerStat) {}
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
export class EffectTestB extends Effect {
  constructor() {
    super(
      '효과 테스트 B',
      '테스트용 효과B 입니다.',
      2,
      '/assets/effect.png'
    );
  }
}
