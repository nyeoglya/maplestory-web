"use client";

import React, { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';

import gameManager from '@/utils/GameManager';

class ExampleScene extends Phaser.Scene {
  private player: Phaser.Physics.Arcade.Sprite | null = null;
  private platforms: Phaser.Physics.Arcade.StaticGroup | null = null;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;

  constructor() {
    super('ExampleScene');
  }

  preload() {
    this.load.setBaseURL('/');
    this.load.image('sky', 'assets/testbackground.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 64, frameHeight: 111 });
  }

  create() {
    this.physics.world.setBounds(0, 0, 1600, 900);

    const sky = this.add.image(0, 0, 'sky').setOrigin(0, 0);
    sky.setScale(this.physics.world.bounds.width / sky.width, this.physics.world.bounds.height / sky.height);

    // 플랫폼 생성
    this.platforms = this.physics.add.staticGroup();
    
    (this.platforms.create(this.physics.world.bounds.width / 2, this.physics.world.bounds.height - 150, 'ground') as Phaser.Physics.Arcade.Sprite)
      .setScale(this.physics.world.bounds.width, 1)
      .refreshBody();

    this.player = this.physics.add.sprite(100, this.physics.world.bounds.height - 400, 'player');
    this.player.setScale(0.8, 0.8);

    this.player.setBounce(0.2);
    // 플레이어가 월드 경계를 벗어날 수 없도록 설정합니다.
    this.player.setCollideWorldBounds(true);

    // 플레이어 애니메이션
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'turn',
      frames: [{ key: 'player', frame: 2 }],
      frameRate: 20
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { start: 3, end: 4 }),
      frameRate: 10,
      repeat: -1
    });

    // 플레이어 플랫폼 충돌 설정
    if (this.player && this.platforms) {
      this.physics.add.collider(this.player, this.platforms);
    }

    this.cursors = this.input.keyboard?.createCursorKeys() || null;

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

  update() {
    if (!this.player || !this.cursors) {
      return;
    }

    // 플레이어 움직임 로직
    const playerSpeed = 200;
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-playerSpeed);
      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(playerSpeed);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    // 점프 로직
    if (this.cursors.up.isDown && this.player.body instanceof Phaser.Physics.Arcade.Body && this.player.body.touching.down) {
      this.player.setVelocityY(-200); // 점프력 증가
    }
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
          debug: false // 디버그 모드는 필요할 때만 true로 변경하세요.
        }
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
      },
      scene: ExampleScene
    };

    const game = new Phaser.Game(config);

    return () => {
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
      {/* Phaser 게임이 여기에 렌더링됩니다. */}
    </div>
  );
};

export default PhaserGame;
