"use client";

import React, { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';

import gameManager from '@/utils/GameManager';
import Entity, { TestEntityA } from './PhaserEntity';
import { PhaserPlayer } from './PhaserPlayer';
import EntityManager from '@/utils/EntityManager';
import { Skill } from '@/utils/Skill';
import { Vector } from 'matter';

class ExampleScene extends Phaser.Scene {
  private player: PhaserPlayer | null = null;
  private platforms: Phaser.Physics.Arcade.StaticGroup | null = null;
  private testPlatform: Phaser.Physics.Arcade.StaticGroup | null = null;

  private entityManager: EntityManager;
  private entitySpawnList: Vector[] = [
    {x: 200, y: 50},
    {x: 250, y: 50},
    {x: 300, y: 50},
  ];

  constructor() {
    super('ExampleScene');
    this.entityManager = gameManager.entityManager;
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

  createTransparentPixelTexture(key: string) {
    if (!this.textures.exists(key)) {
      const graphics = this.add.graphics();
      graphics.fillStyle(0x990000, 150);
      graphics.fillRect(0, 0, 1, 1);
      graphics.generateTexture(key, 1, 1);
      graphics.destroy();
    }
  }

  preload() {
    this.load.setBaseURL('/');
    this.load.image('sky', 'assets/testbackground.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 64, frameHeight: 111 });
    this.load.image('boss', 'assets/boss.png');
    this.load.image('skillTestA', 'assets/skillUse.png');
    this.createTransparentPixelTexture('default_pixel');
  }

  create() {
    this.physics.world.setBounds(0, 0, 2400, 900);

    const sky = this.add.image(0, 0, 'sky').setOrigin(0, 0);
    sky.setScale(this.physics.world.bounds.width / sky.width, this.physics.world.bounds.height / sky.height);

    // 플랫폼 생성
    this.platforms = this.physics.add.staticGroup();
    this.testPlatform = this.physics.add.staticGroup();
    
    (this.platforms.create(this.physics.world.bounds.width / 2, this.physics.world.bounds.height - 150, 'ground') as Phaser.Physics.Arcade.Sprite)
      .setScale(this.physics.world.bounds.width, 1)
      .refreshBody();

    // 적 생성
    this.entityManager.setEntitySpawnList(this.entitySpawnList);
    this.entityManager.spawnLocationList.forEach((pos: Vector) => {
      const testEntityA = new TestEntityA(this, pos);
      this.entityManager.entityList.push(testEntityA);
    });
    this.entityManager.createEntityMap();

    // 적 플랫폼 충돌 설정
    if (this.platforms) {
      const platforms = this.platforms;
      this.entityManager.entityList.forEach((entity: Entity) => {
        if (entity) {
          this.physics.add.collider(entity, platforms);
        }
      });
    }

    // 플레이어 생성
    this.player = new PhaserPlayer(this, 100, this.physics.world.bounds.height - 400, 'player');
    gameManager.phaserPlayer = this.player;

    // 플레이어 플랫폼 충돌 설정
    if (this.player && this.platforms) {
      this.physics.add.collider(this.player, this.platforms);
    }

    // TODO: 개선된 발판
    this.testPlatform.create(500, this.physics.world.bounds.height - 200, 'default_pixel')
      .setScale(200, 10)
      .refreshBody();

    // Collider 설정: processCallback 사용
    const playerPlatformCollider = this.physics.add.collider(
      this.player,
      this.testPlatform,
      undefined,
      (playerObj, platformObj) => {
        if (!("body" in playerObj) || !("body" in platformObj)) return false;
        const player = playerObj as Phaser.Physics.Arcade.Sprite;
        const platform = platformObj as Phaser.Physics.Arcade.Sprite;
        if (!player.body || !platform.body) return;
        const falling = player.body.velocity.y > 0;
        const above = (player.y - player.body.height * (1 - player.originY)) <= platform.y;
        const isAbovePlatform = player.body.bottom <= platform.body.top + player.body.velocity.y * this.game.loop.delta / 1000 + 1; // offset
        return falling && above && isAbovePlatform;
      },
      this
    );

    this.player.disablePlatform = () => {
      if (this.testPlatform) {
        playerPlatformCollider.active = false;
        this.time.delayedCall(300, () => {
          playerPlatformCollider.active = true;
        });
      }
    }

    // 스킬 키 매핑
    gameManager.skillManager.skillKeyMap.forEach((skill: Skill, key: string) => {
      const keyButton = this.input.keyboard!.addKey(key);
      keyButton.on('down', () => {
        if (!this.player || !this.player.detectionZone) return;
        if (!skill.isSkillAvailable(gameManager.player) ||
          gameManager.skillManager.skillCooltimeMap.get(skill) !== undefined) return;
        const overlapEntityList = this.getOverlapEntity(this.player.detectionZone, this.entityManager.entityList);
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
    this.entityManager.entityList.forEach((entity: Entity) => {
      if (!entity) return;
      entity.update(time, delta);
    });
    
    if (!this.player) return;
    this.player.update();
  }
}

const PhaserGame = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialWidth = window.innerWidth;
    const initialHeight = window.innerHeight;
    
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: initialWidth,
      height: initialHeight,
      parent: gameContainerRef.current as HTMLElement,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 500 },
          debug: true
        }
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
      },
      scene: ExampleScene
    };

    const game = new Phaser.Game(config);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey) {
        switch (event.key) {
          case 'ArrowLeft':
          case 'ArrowRight':
            event.preventDefault();
            break;
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      game.destroy(true);
    };
  }, []);

  return (
    <div
      ref={gameContainerRef}
      style={{
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    >
      {/* Phaser 게임이 렌더링되는 장소. */}
    </div>
  );
};

export default PhaserGame;
