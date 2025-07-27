class BaseScene extends Phaser.Scene {
  constructor() {
    super('BaseScene');
  }

  createTransparentPixelTexture(key: string) {
    if (!this.textures.exists(key)) {
      const graphics = this.add.graphics();
      graphics.fillStyle(0xffffff, 0);
      graphics.fillRect(0, 0, 1, 1);
      graphics.generateTexture(key, 1, 1);
      graphics.destroy();
    }
  }

  preload() {
    this.load.setBaseURL('/');
    this.load.image('testbackground', 'assets/testbackground.png');
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 64, frameHeight: 111 });
    this.load.image('boss', 'assets/boss.png');
    this.load.image('skillTestA', 'assets/skillUse.png');
    this.createTransparentPixelTexture('default_pixel');
  }

  create() {
    this.scene.start('WaitingScene');
  }
}

export default BaseScene;
