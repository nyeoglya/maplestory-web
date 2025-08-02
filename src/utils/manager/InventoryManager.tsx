"use client";

import { Item, ItemTestA, ItemTestB, ItemTestC, ItemTestD } from "@/utils/Item";
import { PlayerStat } from "@/utils/Utils";
import { Vector } from "matter";

class InventoryManager {
  public itemList: typeof Item[] = [ItemTestA];
  public currentPlayerInventoryMap: Map<number, Item | null> = (() => {
    const map = new Map<number, Item | null>([
      [0, new ItemTestA()],
      [1, new ItemTestB()],
      [2, new ItemTestC()],
      [3, new ItemTestD()],
    ]);

    for (let i = 4; i < 32; i++) {
      map.set(i, null);
    }

    return map;
  })();
  public mouseItem: Item | null = null;

  public currentArmorInventoryMap: Map<string, { pos: Vector, item: Item | null }> = new Map([
    ['armorHead', { pos: { x: 100, y: 100 }, item: null }],
    ['armorChest', { pos: { x: 100, y: 170 }, item: null }],
  ]);
  public armorLocList: string[] = Array.from(this.currentArmorInventoryMap.keys());

  constructor() {

  }

  public setCurrentPlayerInventory: ((newInventory: Map<number, Item | null>) => void) | undefined = undefined;
  public setCurrentArmorInventory: ((newInventory: Map<string, { pos: Vector, item: Item | null }>) => void) | undefined = undefined;
  public setMouseItem: ((newItem: Item | null) => void) | undefined = undefined;

  // from에서 dest로 itemIndex 위치의 아이템 이동
  public moveItem(from: string, dest: string, fromIndex: number | string | null, destIndex: number | string | null): boolean {
    console.log(from, dest, fromIndex, destIndex);
    if (from === 'mouse' && this.mouseItem) {
      if (dest === 'inventory' && typeof destIndex === 'number') {
        const tempData = this.currentPlayerInventoryMap.get(destIndex) || null;
        this.currentPlayerInventoryMap.set(destIndex, this.mouseItem);
        this.mouseItem = tempData;
        this.setCurrentPlayerInventory?.(this.currentPlayerInventoryMap);
        this.setMouseItem?.(this.mouseItem);
        return this.mouseItem === null;
      } else if (dest === 'armor' && typeof destIndex === 'string') {
        const tempData = this.currentArmorInventoryMap.get(destIndex)?.item || null;
        const pos = this.currentArmorInventoryMap.get(destIndex)?.pos;
        if (!pos) return false;
        this.currentArmorInventoryMap.set(destIndex, { pos: pos, item: this.mouseItem });
        this.mouseItem = tempData;
        this.setCurrentArmorInventory?.(this.currentArmorInventoryMap);
        this.setMouseItem?.(this.mouseItem);
        return this.mouseItem === null;
      }
    } else if (dest === 'mouse') {
      if (from === 'inventory' && typeof fromIndex === 'number') {
        const tempItem = this.currentPlayerInventoryMap.get(fromIndex) ?? null;
        this.currentPlayerInventoryMap.set(fromIndex, this.mouseItem);
        this.mouseItem = tempItem;
        this.setCurrentPlayerInventory?.(this.currentPlayerInventoryMap);
        this.setMouseItem?.(this.mouseItem);
        return this.mouseItem === null;
      } else if (from === 'armor' && typeof fromIndex === 'string') {
        const pos = this.currentArmorInventoryMap.get(fromIndex)?.pos;
        if (!pos) return false;
        const tempItem = this.mouseItem;
        this.mouseItem = this.currentArmorInventoryMap.get(fromIndex)?.item || null;
        this.currentArmorInventoryMap.set(fromIndex, { pos: pos, item: tempItem });
        this.setCurrentArmorInventory?.(this.currentArmorInventoryMap);
        this.setMouseItem?.(this.mouseItem);
        return this.mouseItem === null;
      }
    }
    return false;
  }

  // 아이템 효과 적용
  public itemChain(originalData: PlayerStat): PlayerStat {
    return originalData;
  }
}

export default InventoryManager;
