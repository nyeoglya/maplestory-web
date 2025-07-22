"use client";

import { Item, ItemTestA } from "./Item";

class InventoryManager {
  public itemList: typeof Item[] = [ItemTestA];
  public currentPlayerInventory: Item[] = [
    new ItemTestA()
  ];
  public mouseItem: Item | null = null;
  public armorHead: Item | null = null;
  public armorChest: Item | null = null;

  constructor () {

  }

  public setCurrentPlayerInventory: ((newInventory: Item[]) => void) | undefined = undefined;
  public setMouseItem: ((newItem: Item | null) => void) | undefined = undefined;

  // from에서 dest로 itemIndex 위치의 아이템 이동
  public moveItem(from: string, dest: string, itemIndex: number = 0) {
    if (from === 'inventory' && dest === 'mouse') {
      if (this.currentPlayerInventory.length > itemIndex) {
        const tempItem = this.currentPlayerInventory[itemIndex];
        this.currentPlayerInventory.splice(itemIndex, 1);
        this.mouseItem = tempItem;
        
        this.setCurrentPlayerInventory?.(this.currentPlayerInventory);
        this.setMouseItem?.(this.mouseItem);
      }
    } else if (from === 'mouse' && dest === 'inventory') {
      if (this.mouseItem) {
        this.currentPlayerInventory.push(this.mouseItem);
        this.mouseItem = null;

        this.setCurrentPlayerInventory?.(this.currentPlayerInventory);
        this.setMouseItem?.(this.mouseItem);
      }
    }
  }
}

export default InventoryManager;
