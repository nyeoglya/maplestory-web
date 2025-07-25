"use client";

import { PhaserPlayer } from "@/components/PhaserPlayer";
import EffectManager from "./EffectManager";
import EntityManager from "./EntityManager";
import { PlayerStat } from "./PlayerStat";
import InventoryManager from "./InventoryManager";
import SkillManager from "./SkillManager";

class GameManager {
  public bossRemainingTime: number = 0;
  public inventoryManager: InventoryManager = new InventoryManager();
  public entityManager: EntityManager = new EntityManager();
  public effectManager: EffectManager = new EffectManager();
  public skillManager: SkillManager = new SkillManager(this.entityManager, this.effectManager);

  public entityAttackIntervalId: NodeJS.Timeout;
  public entityRespawnIntervalId: NodeJS.Timeout;

  public player: PlayerStat = {
    position: {x: 0, y: 200},
    name: "TEST",
    health: 500,
    maxHealth: 500,
    mainStat: 50,
    mana: 500,
    maxMana: 600,
  };
  public setCurrentPlayer: ((newPlayer: PlayerStat) => void) | undefined = undefined;
  public phaserPlayer: PhaserPlayer | undefined = undefined;

  constructor() {
    this.entityAttackInterval = this.entityAttackInterval.bind(this);
    this.entityAttackIntervalId = setInterval(this.entityAttackInterval, 3000);
    this.entityRespawnInterval = this.entityRespawnInterval.bind(this);
    this.entityRespawnIntervalId = setInterval(this.entityRespawnInterval, this.entityManager.entitySpawnCooltime);
    this.updatePlayerUi();
  }

  public updatePlayerUi() {
    if (!this.setCurrentPlayer) return;
    this.setCurrentPlayer(this.player);
  }

  public entityRespawnInterval() {
    this.entityManager.respawnEntities();
  }

  public entityAttackInterval() {
    if (!this.phaserPlayer) return;
    this.entityManager.entityAttack(gameManager.player, this.phaserPlayer);
    this.updatePlayerUi(); // TODO: 이걸로 인해 3초에 1번씩 변경됨.
  }

  public attackDamage() {
    return 0;
  }
}

const gameManager: GameManager = new GameManager();

export default gameManager;
