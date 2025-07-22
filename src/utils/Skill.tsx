import {PlayerStat} from "./interface";

abstract class Skill {
  constructor(
    public name: string,
    public description: string,
    public cooltime: number,
    public isPassive: boolean,
    public iconImgPath: string = '',
    public skillImgPath: string = '',
  ) {
    
  }

  public isSkillAvailable(data: PlayerStat): boolean {
    return false;
  }

  // 자원의 소모.
  public consume(data: PlayerStat): PlayerStat {
    return {} as PlayerStat;
  }

  // 사용되는 스킬
  public skill() {

  }
}

class SkillTestA extends Skill {
  constructor() {
    super('스킬 테스트 A', '테스트용 스킬입니다.', 10, false);
  }
}

class SkillManager {
  constructor() {
    
  }
}

export default SkillManager;
