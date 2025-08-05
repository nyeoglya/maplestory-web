"use client";

import PhaserPlayer from "@/components/phaser/PhaserPlayer";
import BossEntity from "@/components/phaser/entity/PhaserBossEntity";
import EffectManager from "./EffectManager";
import EntityManager from "./EntityManager";
import InventoryManager from "./InventoryManager";
import SkillManager from "./SkillManager";
import { PlayerStat, SceneMoveData } from "@/utils/Utils";
import Entity from "@/components/phaser/entity/PhaserEntity";
import EntityPizza from "@/components/phaser/entity/PhaserPizzaEntity";
import NPCManager from "./NPCManager";
import Dialog from "../Dialog";
import QuestManager from "./QuestManager";

class GameManager {
  public player: PlayerStat = {
    speed: { x: 200, y: 200 },
    name: "메린이",
    health: 500,
    maxHealth: 500,
    mainStat: 50,
    mana: 500,
    maxMana: 600,
    isMove: true,
    flipKey: false,
    damageMultiplier: 1.0,
    attackMultiplier: 1.0,
    level: 0,
  };
  public gameWidth: number = 0;
  public gameHeight: number = 0;
  public deathCount: number = 5;

  public droppedItems: Entity[] = [];
  public inventoryManager: InventoryManager = new InventoryManager();

  public normalEntityManager: EntityManager = new EntityManager();
  public fallingEntityManager: EntityManager = new EntityManager();
  public bossEntityManager: EntityManager = new EntityManager();

  public npcManager: NPCManager = new NPCManager();

  public effectManager: EffectManager = new EffectManager();
  public skillManager: SkillManager = new SkillManager(this.player, this.normalEntityManager, this.effectManager);

  public questManager: QuestManager = new QuestManager();

  public phaserPlayer: PhaserPlayer | undefined = undefined;
  public bossEntity: BossEntity | undefined = undefined;
  public pizzaEntity: EntityPizza | undefined = undefined;

  public toggleBossWindow: ((value: boolean) => void) | undefined = undefined;
  public toggleVideoPlay: ((value: boolean) => void) | undefined = undefined;
  public moveScene: SceneMoveData | null = null;
  public backgroundBGM: Phaser.Sound.BaseSound | undefined = undefined;

  public currentDialog: Dialog | null = null;
  public setCurrentDialog: ((value: Dialog) => void) | undefined = undefined;

  constructor() { }
}

const gameManager: GameManager = new GameManager();

export default gameManager;
