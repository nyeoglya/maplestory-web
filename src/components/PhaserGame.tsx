"use client";

import React, { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';

// Phaser 씬 정의
class ExampleScene extends Phaser.Scene {
  // 클래스 프로퍼티에 타입 명시
  private player: Phaser.Physics.Arcade.Sprite | null = null;
  private platforms: Phaser.Physics.Arcade.StaticGroup | null = null;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;

  constructor() {
    super('ExampleScene');
  }

  preload() {
    this.load.setBaseURL('https://labs.phaser.io/');
    this.load.image('sky', 'assets/skies/space3.png');
    // 로고는 사용하지 않을 예정이지만, 기존 코드 유지를 위해 남겨둡니다.
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.spritesheet('dude', 'assets/sprites/dude.png', { frameWidth: 32, frameHeight: 48 });
  }

  create() {
    this.physics.world.setBounds(0, 0, 3200, 1200);

    const sky = this.add.image(0, 0, 'sky').setOrigin(0, 0);
    sky.setScale(this.physics.world.bounds.width / sky.width, this.physics.world.bounds.height / sky.height);

    // 플랫폼 생성
    this.platforms = this.physics.add.staticGroup();
    
    (this.platforms.create(this.physics.world.bounds.width / 2, this.physics.world.bounds.height - 150, 'ground') as Phaser.Physics.Arcade.Sprite)
      .setScale(this.physics.world.bounds.width, 1)
      .refreshBody();

    this.player = this.physics.add.sprite(100, this.physics.world.bounds.height - 200, 'dude');

    this.player.setBounce(0.2);
    // 플레이어가 월드 경계를 벗어날 수 없도록 설정합니다.
    this.player.setCollideWorldBounds(true);

    // 플레이어 애니메이션 정의 (기존과 동일)
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    // 플레이어와 플랫폼 충돌 설정
    if (this.player && this.platforms) {
      this.physics.add.collider(this.player, this.platforms);
    }

    // 키보드 입력 설정
    this.cursors = this.input.keyboard?.createCursorKeys() || null;

    // --- 카메라 설정: 이 부분이 핵심입니다! ---
    if (this.player) {
      // 카메라가 플레이어를 따라가도록 설정합니다.
      this.cameras.main.startFollow(this.player);

      // 카메라가 월드 경계를 벗어나지 않도록 설정합니다.
      // 이렇게 하면 플레이어가 맵의 끝에 도달했을 때 카메라가 더 이상 스크롤되지 않습니다.
      this.cameras.main.setBounds(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height);
    }
    // ----------------------------------------
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

    // 플레이어 움직임 로직 (이동 속도 증가)
    const playerSpeed = 300; // 플레이어 이동 속도
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
      this.player.setVelocityY(-400); // 점프력 증가
    }
  }
}

const PhaserGame = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 윈도우의 현재 너비와 높이로 초기 게임 크기를 설정합니다.
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
          gravity: { x: 0, y: 300 },
          debug: false // 디버그 모드는 필요할 때만 true로 변경하세요.
        }
      },
      scale: {
        mode: Phaser.Scale.RESIZE, // 윈도우 크기 변경에 따라 캔버스 크기 조정
        // 이 모드에서는 autoCenter를 사용하지 않습니다.
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
