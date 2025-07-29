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
    this.load.image('waitingMap', 'assets/waitingmap.png');
    this.load.image('bossMap', 'assets/bossmap.png');

    this.load.image('pizza', 'assets/pizza.png');
    this.load.image('brmint', 'assets/brmint.png');
    this.load.image('brgreentea', 'assets/brgreentea.png');
    this.load.image('breum', 'assets/breum.png');
    this.load.image('brmint', 'assets/brmint.png');

    this.load.image('boss', 'assets/boss.png');
    this.load.image('cleaner', 'assets/cleaner.png');
    this.load.image('galus', 'assets/galus.png');
    this.load.image('targetpos', 'assets/targetpos.png');
    this.load.image('bossHand', 'assets/bossHand.png');
    this.load.image('meso', 'assets/meso.png');

    this.load.image('starforce', 'assets/starforce.png');

    this.load.image('skillUse', 'assets/skillUse.png');
    this.load.audio('bossfight', 'assets/bossfight.mp3');

    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 64, frameHeight: 111 });

    this.createTransparentPixelTexture('default_pixel');
  }

  create() {
    this.scene.start('WaitingScene');
  }
}

export default BaseScene;
