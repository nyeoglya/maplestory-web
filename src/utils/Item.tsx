import { PlayerStat } from "./interface";

export abstract class Item {
  constructor(
    public name: string,
    public description: string,
    public itemIconPath: string = '',
    public uuid: string = crypto.randomUUID(),
  ) {}

  // 아이템의 성능
  public itemEffect(data: PlayerStat): PlayerStat {
    return data;
  }
}

export class ItemTestA extends Item {
  constructor() {
    super(
      '앱솔칼리버',
      '끝이 있어야 새로운 시작이 있으니, 사라질 운명 그저 감사할 뿐.',
      '/assets/item.png',
    );
  };
}
