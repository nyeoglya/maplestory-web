"use client";

import * as Phaser from 'phaser';

import gameManager from '@/utils/GameManager';
import Entity, { TestEntityA } from './PhaserEntity';
import { PhaserPlayer } from './PhaserPlayer';
import EntityManager from '@/utils/EntityManager';
import { Skill } from '@/utils/Skill';
import { Vector } from 'matter';
import BossEntity from './PhaserBossEntity';
import FloatingEntity from './PhaserFloatingEntity';

class PhaserBossScene extends Phaser.Scene {
  private player: PhaserPlayer | null = null;
  private boss: BossEntity | null = null;
  private rock: FloatingEntity | null = null;
  private platforms: Phaser.Physics.Arcade.StaticGroup | null = null;

  private entityManager: EntityManager;
  private entitySpawnList: Vector[] = [];

  constructor() {
    super('BossScene');
    this.entityManager = gameManager.entityManager;
  }

  createTransparentPixelTexture(key: string) {
    if (!this.textures.exists(key)) {
      const graphics = this.add.graphics();
      graphics.fillStyle(0x990000, 150);
      graphics.fillRect(0, 0, 1, 1);
      graphics.generateTexture(key, 1, 1);
      graphics.destroy();
    }
  }

  private getOverlapEntity(
    detectionZone: Phaser.Physics.Arcade.StaticBody,
    targetGroup: Entity[],
  ): string[] {
    const overlapUuidList: string[] = [];
    if (!detectionZone) return [];

    targetGroup.forEach(entity => {
      const entityBody: Phaser.Physics.Arcade.Body = entity.getBody();
      if (!entityBody) return;
      
      this.physics.overlap(detectionZone, entityBody, () => {
        overlapUuidList.push(entity.uuid);
      }, undefined, this);
    });

    return overlapUuidList;
  }

  // TODO: 한번만 로딩하면 되기 때문에 중복 지우기
  preload() {
    this.load.setBaseURL('/');
    this.load.image('sky', 'assets/testbackground.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 64, frameHeight: 111 });
    this.load.image('boss', 'assets/boss.png');
    this.load.image('rock', 'assets/rock.png');
    this.load.image('skillTestA', 'assets/skillUse.png');
    this.createTransparentPixelTexture('default_pixel');
  }

  create() {
    this.physics.world.setBounds(0, 0, 2400, 900);

    const sky = this.add.image(0, 0, 'sky').setOrigin(0, 0);
    sky.setScale(this.physics.world.bounds.width / sky.width, this.physics.world.bounds.height / sky.height);

    // 플랫폼 생성
    this.platforms = this.physics.add.staticGroup();
    
    (this.platforms.create(this.physics.world.bounds.width / 2, this.physics.world.bounds.height - 150, 'ground') as Phaser.Physics.Arcade.Sprite)
      .setScale(this.physics.world.bounds.width, 1)
      .refreshBody();

    // 적 생성
    this.boss = new BossEntity(this, {x: 250, y: this.physics.world.bounds.height - 250});

    // 적 플랫폼 충돌 설정
    if (this.boss && this.platforms) {
      this.physics.add.collider(this.boss, this.platforms);
    }

    // 장애물 생성
    this.rock = new FloatingEntity(this, {x: 250, y: 150});

    // 플레이어 생성
    this.player = new PhaserPlayer(this, 100, this.physics.world.bounds.height - 400, 'player');
    gameManager.phaserPlayer = this.player;

    // 플레이어 플랫폼 충돌 설정
    if (this.player && this.platforms) {
      this.physics.add.collider(this.player, this.platforms);
    }

    // 스킬 키 매핑
    gameManager.skillManager.skillKeyMap.forEach((skill: Skill, key: string) => {
      const keyButton = this.input.keyboard!.addKey(key);
      keyButton.on('down', () => {
        if (!this.player || !this.player.detectionZone) return;
        if (!skill.isSkillAvailable(gameManager.player) ||
          gameManager.skillManager.skillCooltimeMap.get(skill) !== undefined) return;
        if (!this.boss) return;
        const overlapEntityList = this.getOverlapEntity(this.player.detectionZone, [this.boss]); // TODO: 이거 코드 간소화하기
        if (skill.skillImgPath) {
          this.player.showSkillImg(skill.skillImgPath);
        }
        const effectedPlayer = gameManager.effectManager.effectChain(gameManager.player);
        gameManager.skillManager.skillUse(skill, effectedPlayer, overlapEntityList);
      });
    });

    if (this.player) {
      this.cameras.main.startFollow(this.player);
      this.cameras.main.setBounds(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height);
    }

    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      if (this.cameras.main) {
        this.cameras.main.setSize(gameSize.width, gameSize.height);
      }
    });
  }

  update(time: number, delta: number): void {
    if (!this.boss) return;
    this.boss.update();
    
    if (!this.player) return;
    this.player.update();

    if (!this.rock) return;
    this.rock.update();
  }
}

export default PhaserBossScene;
