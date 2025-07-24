import { PlayerStat } from "./PlayerStat";

export abstract class Item {
  constructor(
    public name: string,
    public description: string,
    public itemIconPath: string = '',
    public uuid: string,
  ) {
    if (typeof window !== 'undefined') {
      this.uuid = crypto.randomUUID();
    } else {
      this.uuid = 'server-side-item-uuid-' + Math.random().toString(36).substring(2, 15);
    }}

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

export class ItemTestB extends Item {
  constructor() {
    super(
      '투구',
      '',
      '/assets/head.png',
    );
  };
}

export class ItemTestC extends Item {
  constructor() {
    super(
      '갑옷',
      '',
      '/assets/chestplate.png',
    );
  };
}

export class ItemTestD extends Item {
  constructor() {
    super(
      '레깅스',
      '',
      '/assets/leggings.png',
    );
  };
}
