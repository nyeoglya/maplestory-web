"use client";

import { PhaserPlayer } from "@/components/PhaserPlayer";
import EffectManager from "./EffectManager";
import EntityManager from "./EntityManager";
import { PlayerStat } from "./Utils";
import InventoryManager from "./InventoryManager";
import SkillManager from "./SkillManager";
import BossEntity from "@/components/PhaserBossEntity";

class GameManager {
  public bossRemainingTime: number = 0;
  public inventoryManager: InventoryManager = new InventoryManager();
  
  public normalEntityManager: EntityManager = new EntityManager();
  public floatingEntityManager: EntityManager = new EntityManager();

  public effectManager: EffectManager = new EffectManager();
  public skillManager: SkillManager = new SkillManager(this.normalEntityManager, this.effectManager);

  public normalEntityAttackIntervalId: NodeJS.Timeout;
  public normalEntityRespawnIntervalId: NodeJS.Timeout;
  public floatingEntityAttackIntervalId: NodeJS.Timeout;
  public bossEntityAttackIntervalId: NodeJS.Timeout;
  public playerUiUpdateIntervalId: NodeJS.Timeout;

  public player: PlayerStat = {
    position: {x: 0, y: 200},
    speed: {x: 200, y: 200},
    name: "TEST",
    health: 500,
    maxHealth: 500,
    mainStat: 50,
    mana: 500,
    maxMana: 600,
  };
  public effectAppliedPlayerStat() {
    const baseStat = JSON.parse(JSON.stringify(this.player));
    return this.effectManager.effectChain(baseStat);
  }
  public setCurrentPlayer: ((newPlayer: PlayerStat) => void) | undefined = undefined;
  public phaserPlayer: PhaserPlayer | undefined = undefined;
  public bossEntity: BossEntity | undefined = undefined;

  constructor() {
    this.normalEntityAttackInterval = this.normalEntityAttackInterval.bind(this);
    this.normalEntityAttackIntervalId = setInterval(this.normalEntityAttackInterval, 3000);
    this.normalEntityRespawnInterval = this.normalEntityRespawnInterval.bind(this);
    this.normalEntityRespawnIntervalId = setInterval(this.normalEntityRespawnInterval, this.normalEntityManager.entitySpawnCooltime);

    this.floatingEntityAttackIntervalId = setInterval(this.floatingEntityAttackInterval, 100);
    this.bossEntityAttackIntervalId = setInterval(this.bossEntityAttackInterval, 5000);
    this.playerUiUpdateIntervalId = setInterval(this.playerUiUpdateInterval, 500);
    
    this.updatePlayerUi();
  }

  public updatePlayerUi() {
    if (!this.setCurrentPlayer) return;
    this.setCurrentPlayer(this.player);
  }

  public normalEntityRespawnInterval() {
    this.normalEntityManager.respawnEntities();
  }

  public normalEntityAttackInterval() {
    if (!this.phaserPlayer) return;
    this.normalEntityManager.entityAttack(gameManager.player, this.phaserPlayer);
  }

  public floatingEntityAttackInterval = (() => {
    if (!this.phaserPlayer) return;
    this.floatingEntityManager.entityAttack(gameManager.player, this.phaserPlayer);
  }).bind(this);

  public bossEntityAttackInterval = (() => {
    if (!this.phaserPlayer || !this.bossEntity) return;
    // this.bossEntity.tryAttack();
  }).bind(this);

  public playerUiUpdateInterval = (() => {
    this.updatePlayerUi(); // 0.5초에 1번씩 ui 업데이트.
  }).bind(this);

  public attackDamage() {
    return 0;
  }
}

const gameManager: GameManager = new GameManager();

export default gameManager;
