import { Vector } from "matter";

export interface PlayerStat {
  position: Vector;
  name: string;
  health: number;
  maxHealth: number;
  mainStat: number;
  mana: number;
  maxMana: number;
}
