import {PlayerStat} from "./interface";

abstract class Item {
  constructor(
    public name: string,
    public description: string,
    public itemIconPath: string = '',
  ) {}
}

class ItemTestA extends Item {
  constructor() {
    super(
      '아이템A',
      '아이템A입니다.',
      '',
    );
  };
}

class InventoryManager {
  public itemList: typeof Item[] = [ItemTestA];
  public currentPlayerInventory: Item[] = [];

  constructor () {

  }
}

export default InventoryManager;
