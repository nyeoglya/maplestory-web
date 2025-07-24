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

  preload() {
    this.load.setBaseURL('/');
    this.load.image('sky', 'assets/testbackground.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 64, frameHeight: 111 });
    this.load.image('boss', 'assets/boss.png');
    this.load.image('skillTestA', 'assets/skillUse.png');
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

    // 스킬 키 매핑
    gameManager.skillManager.skillKeyMap.forEach((skill: Skill, key: string) => {
      const keyButton = this.input.keyboard!.addKey(key);
      keyButton.on('down', () => {
        if (!this.player || !this.player.detectionZone) return;
        if (!skill.isSkillAvailable(gameManager.player) ||
          gameManager.skillManager.skillCooltimeMap.get(skill) !== undefined) return;
        const overlapEntityList = this.getOverlapEntity(this.player.detectionZone, this.entityManager.entityList);
        gameManager.skillManager.skillUse(skill, gameManager.player, overlapEntityList);
        this.player.showSkillImg(skill.skillImgPath);
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

const spawnDamageText = (scene: Phaser.Scene, x: number, y: number, text: string, duration = 1000, riseHeight = 50) => {
  // 텍스트 객체 생성
  const damageText = scene.add.text(x, y, text, {
    fontSize: '20px',
    stroke: '#000000',
    strokeThickness: 2,
    fontStyle: 'bold',
  });

  // 텍스트의 원점을 중앙 하단으로 설정하여 숫자가 위로 솟아오르게 함
  damageText.setOrigin(0.5, 1);

  // 애니메이션 (움직임 + 페이드)
  scene.tweens.add({
    targets: damageText,
    y: y - riseHeight,
    alpha: { from: 1, to: 0 },
    duration: duration,
    ease: 'Power1',
    onComplete: () => {
      damageText.destroy();
    }
  });
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
