import {PlayerStat} from "./interface";

abstract class Effect {
  constructor(
    public name: string,
    public description: string,
    public duration: number,
    public effectIconPath: string = '',
  ) {}

  // 실제 효과
  public effect(data: PlayerStat): PlayerStat {
    return {} as PlayerStat;
  }
}

// 버프
class EffectTestA extends Effect {
  constructor() {
    super(
      '효과 테스트 A',
      '테스트용 효과A 입니다.',
      20,
      '/assets/effect.png'
    );
  }
}

// 디버프
class EffectTestB extends Effect {
  constructor() {
    super('효과 테스트 B', '테스트용 효과B 입니다.', 10);
  }
}

class EffectManager {
  public effectList: typeof Effect[] = [EffectTestA, EffectTestB];
  public currentPlayerEffect: Effect[] = [
    new EffectTestA(),
  ];

  constructor () {

  }

  // 효과 중첩 시, 입력은 base, 출력은 최종 결과
  public effectChain(basePlayerData: PlayerStat): PlayerStat {
    return {} as PlayerStat;
  }
}

export default EffectManager;
