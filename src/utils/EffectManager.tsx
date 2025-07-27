"use client";

import { Effect, EffectTestA, EffectTestB } from "./Effect";
import { PlayerStat } from "./Utils";

class EffectManager {
  public currentPlayerEffect: Effect[] = [
    new EffectTestA(),
    new EffectTestB(),
  ];
  public effectDurationIntervalId: NodeJS.Timeout;

  public setCurrentEffect: ((newEffectList: Effect[]) => void) | undefined = undefined;
  
  public updateEffectUi() {
    if (!this.setCurrentEffect) return;
    this.setCurrentEffect(this.currentPlayerEffect);
  }
  
  // 효과 추가
  public addEffect(effectType: new () => Effect) {
    const oldEffect = this.currentPlayerEffect.find(effect => {
      return effect instanceof effectType;
    });

    if (!oldEffect) {
      this.currentPlayerEffect.push(new effectType());
    } else {
      oldEffect.duration = new effectType().duration;
    }

    this.updateEffectUi();
  }

  constructor () {
    this.effectDurationInterval = this.effectDurationInterval.bind(this);
    this.effectDurationIntervalId = setInterval(this.effectDurationInterval, 1000);
  }

  public effectDurationInterval() {
    if (this.currentPlayerEffect.length === 0) return;
    this.currentPlayerEffect.forEach((effect: Effect) => {
      effect.duration -= 1;
    });

    this.currentPlayerEffect = this.currentPlayerEffect.filter(
      (effect: Effect) => effect.duration > 0
    );

    this.updateEffectUi();
  }

  // 효과 중첩 시, 입력은 base, 출력은 최종 결과
  public effectChain(basePlayerData: PlayerStat): PlayerStat {
    const effectedPlayer = JSON.parse(JSON.stringify(basePlayerData)); // TODO: position은 Vector라서 복사가 안됨에 유의할 것.
    this.currentPlayerEffect.forEach((effect: Effect) => {
      effect.effect(effectedPlayer);
    });
    return effectedPlayer;
  }
}

export default EffectManager;
