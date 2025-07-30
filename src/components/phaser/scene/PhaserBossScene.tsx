"use client";

import * as Phaser from 'phaser';

import gameManager from '@/utils/manager/GameManager';
import { Skill } from '@/utils/Skill';
import { getOverlapEntity } from '@/utils/Utils';
import PhaserPlayer from '../PhaserPlayer';
import BossEntity from '../entity/PhaserBossEntity';
import { Vector } from 'matter';
import Entity from '../entity/PhaserEntity';
import EntityCleaner from '../entity/PhaserCleanerEntity';
import EntityPizza from '../entity/PhaserPizzaEntity';
import EntityStar from '../entity/PhaserStarEntity';
import { EntityFallingEum, EntityFallingGreenTea, EntityFallingMint } from '../entity/PhaserFallingEntity';

class PhaserBossScene extends Phaser.Scene {
  private player: PhaserPlayer | null = null;
  private boss: BossEntity | null = null;
  private pizza: EntityPizza | null = null;
  private star: EntityStar | null = null;
  private platforms: Phaser.Physics.Arcade.StaticGroup | null = null;
  private bgm!: Phaser.Sound.BaseSound;

  private normalEntityLoc: Vector[] = [];

  constructor() {
    super('BossScene');
  }

  create() {
    this.bgm = this.sound.add('bossfight', {
      loop: true,
      volume: 0.05
    });

    this.bgm.play();

    gameManager.gameHeight = 800; // this.sys.game.config.height as number
    const image = this.textures.get('bossMap').getSourceImage() as HTMLImageElement;
    const scale = gameManager.gameHeight / image.height;
    gameManager.gameWidth = image.width * scale;
    this.physics.world.setBounds(0, 0, gameManager.gameWidth, gameManager.gameHeight);

    const floorY = this.physics.world.bounds.height - 130;

    // 몹 생성 위치
    const step = gameManager.gameWidth / 8;
    const xList = [];
    for (let i = 1; i <= 6; i++) xList.push(step * i);
    this.normalEntityLoc = xList.map(x => ({ x, y: floorY - 100 }));

    const sky = this.add.image(0, 0, 'bossMap').setOrigin(0, 0);
    sky.setScale(this.physics.world.bounds.width / sky.width, this.physics.world.bounds.height / sky.height);

    this.cameras.main.setZoom(1.5); // 카메라 줌

    // 플랫폼 생성
    this.platforms = this.physics.add.staticGroup();
    (this.platforms.create(0, floorY, 'default_pixel') as Phaser.Physics.Arcade.Sprite)
      .setOrigin(0, 0)
      .setScale(this.physics.world.bounds.width, 10)
      .refreshBody();

    // 별 생성
    this.star = new EntityStar(this, { x: 100, y: floorY - 100 })
    gameManager.starEntity = this.star;

    // 적 생성
    this.boss = new BossEntity({ scene: this, pos: { x: gameManager.gameWidth / 2, y: floorY - 120 }, floorY: floorY });
    this.boss.mainPlatform = this.platforms;
    this.pizza = new EntityPizza({ scene: this, pos: { x: 0, y: 0 } });
    this.pizza.setDeath();
    gameManager.bossEntity = this.boss;
    gameManager.pizzaEntity = this.pizza;
    gameManager.bossEntityManager.entityList.push(this.boss);
    this.normalEntityLoc.forEach((pos: Vector) => {
      const entity = new EntityCleaner(this, pos, this.physics.world.bounds.width);
      entity.mainPlatform = this.platforms;
      gameManager.normalEntityManager.entityList.push(entity);
      if (this.platforms) this.physics.add.collider(entity, this.platforms);
    });
    for (let i = 0; i < 3; i++) {
      const entityMint = new EntityFallingMint(this, { x: 0, y: 0 }, floorY);
      const entityEum = new EntityFallingEum(this, { x: 0, y: 0 }, floorY);
      const entityGreenTea = new EntityFallingGreenTea(this, { x: 0, y: 0 }, floorY);
      entityMint.setDeath();
      entityEum.setDeath();
      entityGreenTea.setDeath();
      gameManager.fallingEntityManager.entityList.push(entityMint);
      gameManager.fallingEntityManager.entityList.push(entityEum);
      gameManager.fallingEntityManager.entityList.push(entityGreenTea);
    }
    gameManager.normalEntityManager.resetEntityMap();
    gameManager.fallingEntityManager.resetEntityMap();
    gameManager.bossEntityManager.resetEntityMap();

    // 적 플랫폼 충돌 설정
    if (this.boss && this.platforms) {
      this.physics.add.collider(this.boss, this.platforms);
    }

    // 플레이어 생성
    this.player = new PhaserPlayer(this, 100, floorY - 50, 'player');
    gameManager.phaserPlayer = this.player;

    // 플레이어 플랫폼 충돌 설정
    if (this.player && this.platforms) {
      this.physics.add.collider(this.player, this.platforms);
    }

    // 스킬 키 매핑
    gameManager.skillManager.skillKeyMap.forEach((skill: Skill, key: string) => {
      const keyButton = this.input.keyboard!.addKey(key);
      keyButton.on('down', () => {
        if (!this.player || !this.player.detectionZone || !this.boss) return;
        if (!skill.isSkillAvailable(gameManager.player) ||
          gameManager.skillManager.skillCooltimeMap.get(skill) !== undefined) return;
        const overlapNormalEntityList = getOverlapEntity(this, this.player.detectionZone, gameManager.normalEntityManager.entityList);
        const overlapBossEntityList = getOverlapEntity(this, this.player.detectionZone, gameManager.bossEntityManager.entityList);
        this.player.showSkillImg(skill.skillImgPath);
        const effectedPlayer = gameManager.effectManager.effectChain(gameManager.player);
        gameManager.skillManager.setCurrentEntityManager(gameManager.normalEntityManager);
        gameManager.skillManager.skillUse(skill, effectedPlayer, overlapNormalEntityList);
        gameManager.skillManager.setCurrentEntityManager(gameManager.bossEntityManager);
        gameManager.skillManager.skillUse(skill, effectedPlayer, overlapBossEntityList);
        gameManager.skillManager.skillSetCooltime(skill);
      });
    });

    if (this.player) {
      this.cameras.main.startFollow(this.player);
      this.cameras.main.followOffset.set(0, gameManager.gameHeight * 0.15);
      this.cameras.main.setBounds(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height);
    }

    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      if (this.cameras.main) {
        this.cameras.main.setSize(gameSize.width, gameSize.height);
      }
    });

    this.time.addEvent({
      delay: 3000,
      callback: () => {
        if (!gameManager.phaserPlayer) return;
        gameManager.normalEntityManager.entityAttack(gameManager.player, gameManager.phaserPlayer);
      },
      loop: true
    });
  }

  update(time: number, delta: number): void {
    if (!this.boss) return;
    this.boss.update();

    if (!this.player) return;
    this.player.update();

    if (!this.pizza) return;
    this.pizza.update();

    if (!this.star) return;
    this.star.update();

    gameManager.normalEntityManager.entityList.forEach((entity: Entity) => entity.update(time, delta));
    gameManager.fallingEntityManager.entityList.forEach((entity: Entity) => entity.update(time, delta));
    gameManager.bossEntityManager.entityList.forEach((entity: Entity) => entity.update(time, delta));
  }
}

export default PhaserBossScene;
