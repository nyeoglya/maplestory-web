import EffectManager from "./Effect";
import { PlayerStat } from "./interface";
import InventoryManager from "./Item";

class GameManager {
  public bossRemainingTime: number = 0;
  public effectManager: EffectManager = new EffectManager();
  public inventoryManager: InventoryManager = new InventoryManager();
  
  public player: PlayerStat = {
    position: {x: 0, y: 200},
    name: "TEST",
    health: 50,
    maxHealth: 100,
    mainStat: 50,
    mana: 40,
    maxMana: 200,
  };

  constructor() {

  }

  public attackDamage() {
    return 0;
  }
}

const gameManager: GameManager = new GameManager();

export default gameManager;
