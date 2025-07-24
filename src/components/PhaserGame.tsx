"use client";

import React, { useEffect, useRef } from 'react';

import gameManager from '@/utils/GameManager';

import EntityManager from '@/utils/EntityManager';
import { Skill } from '@/utils/Skill';
import { Vector } from 'matter';

const PhaserGame = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically import Phaser inside useEffect to ensure it's client-side only
    import('phaser').then((Phaser) => {
      // Dynamically import Entity and PhaserPlayer after Phaser is loaded
      Promise.all([
        import('./PhaserEntity'),
        import('./PhaserPlayer'),
      ]).then(([{ default: Entity }, { PhaserPlayer }]) => {

        class ExampleScene extends (Phaser as any).Scene {
          private player: any | null = null;
          private platforms: any | null = null;

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
            detectionZone: any,
            targetGroup: any[],
          ): string[] {
            const overlapUuidList: string[] = [];
            if (!detectionZone) return [];

            targetGroup.forEach(entity => {
              const entityBody: any = entity.getBody();
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

            this.platforms = this.physics.add.staticGroup();
            
            (this.platforms.create(this.physics.world.bounds.width / 2, this.physics.world.bounds.height - 150, 'ground') as any)
              .setScale(this.physics.world.bounds.width, 1)
              .refreshBody();

            this.player = new PhaserPlayer(Phaser, this, 100, this.physics.world.bounds.height - 400, 'player');
            gameManager.phaserPlayer = this.player;

            if (this.player && this.platforms) {
              this.physics.add.collider(this.player.sprite, this.platforms);
            }

            if (this.platforms) {
              const platforms = this.platforms;
              this.entityManager.entityList.forEach((entity: any) => {
                if (entity) {
                  this.physics.add.collider(entity.container, platforms);
                }
              });
            }

            gameManager.skillManager.skillKeyMap.forEach((skill: Skill, key: string) => {
              const keyButton = this.input.keyboard!.addKey(key);
              keyButton.on('down', () => {
                if (!this.player || !this.player.detectionZone) return;
                if (gameManager.skillManager.skillCooltimeMap.get(skill) !== undefined) return;
                const overlapEntityList = this.getOverlapEntity(this.player.detectionZone, this.entityManager.entityList);
                gameManager.skillManager.skillUse(skill, gameManager.player, overlapEntityList);
                this.player.showSkillImg(skill.name);
              });
            });

            if (this.player) {
              this.cameras.main.startFollow(this.player.sprite);
              this.cameras.main.setBounds(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height);
            }

            this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
              if (this.cameras.main) {
                this.cameras.main.setSize(gameSize.width, gameSize.height);
              }
            });
          }

          update(time: number, delta: number): void {
            this.entityManager.entityList.forEach((entity: any) => {
              if (!entity) return;
              entity.update(time, delta);
            });
            
            if (!this.player) return;
            this.player.update();
          }
        }

        const spawnDamageText = (scene: any, x: number, y: number, text: string, duration = 1000, riseHeight = 50) => {
          const damageText = scene.add.text(x, y, text, {
            fontSize: '20px',
            stroke: '#000000',
            strokeThickness: 2,
            fontStyle: 'bold',
          });

          damageText.setOrigin(0.5, 1);

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

        const initialWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
        const initialHeight = typeof window !== 'undefined' ? window.innerHeight : 0;

        const config: any = {
          type: (Phaser as any).AUTO,
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
            mode: (Phaser as any).Scale.RESIZE,
          },
          scene: ExampleScene
        };

        const game = new (Phaser as any).Game(config);

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
      }); // End of Promise.all then block
    }); // End of Phaser import then block
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
    </div>
  );
};

export default PhaserGame;
