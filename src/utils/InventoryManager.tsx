"use client";

import { Item, ItemTestA, ItemTestB, ItemTestC, ItemTestD } from "./Item";
import { PlayerStat } from "./PlayerStat";

class InventoryManager {
  public itemList: typeof Item[] = [ItemTestA];
  public currentPlayerInventory: Item[] = [
    new ItemTestA(),
    new ItemTestB(),
    new ItemTestC(),
    new ItemTestD()
  ];
  public mouseItem: Item | null = null;

  public currentArmorInventory: Map<string, Item | null> = new Map([
    ['armorHead', null],
    ['armorChest', null],
  ]); // index 0부터 시작
  public armorLocList: string[] = Array.from(this.currentArmorInventory.keys());

  constructor () {

  }

  public setCurrentPlayerInventory: ((newInventory: Item[]) => void) | undefined = undefined;
  public setMouseItem: ((newItem: Item | null) => void) | undefined = undefined;

  // from에서 dest로 itemIndex 위치의 아이템 이동
  public moveItem(from: string, dest: string, itemIndex: number = 0) {
    if (from === 'mouse' && this.mouseItem) {
      if (dest === 'inventory') {
        if (this.mouseItem) {
          this.currentPlayerInventory.push(this.mouseItem);
          this.mouseItem = null;

          this.setCurrentPlayerInventory?.(this.currentPlayerInventory);
          this.setMouseItem?.(this.mouseItem);
        }
      } else if (dest in this.armorLocList) {
        if (this.mouseItem) {
          // TODO
        }
      }
    } else if (dest === 'mouse') {
      if (this.mouseItem) { } else { } // TODO: temp item 넣기

      if (from === 'inventory') {
        if (this.currentPlayerInventory.length > itemIndex) {
          const tempItem = this.currentPlayerInventory[itemIndex];
          this.currentPlayerInventory.splice(itemIndex, 1);
          this.mouseItem = tempItem;
          
          this.setCurrentPlayerInventory?.(this.currentPlayerInventory);
          this.setMouseItem?.(this.mouseItem);
        }
      } else if (from in this.armorLocList) {
        // TODO
      }
    }
  }

  // 아이템 효과 적용
  public itemChain(originalData: PlayerStat): PlayerStat {
    return originalData;
  }
}

export default InventoryManager;
