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
    this.load.image('townMap', 'assets/townmap.png');
    this.load.image('waitingMap', 'assets/waitingmap.png');
    this.load.image('bossNoonMap', 'assets/bossfightnoon.png');
    this.load.image('bossNightMap', 'assets/bossfightnight.png');

    this.load.image('teleportpad', 'assets/teleportpad.png');

    this.load.image('pizza', 'assets/pizza.png');
    this.load.image('brmint', 'assets/brmint.png');
    this.load.image('brgreentea', 'assets/brgreentea.png');
    this.load.image('breum', 'assets/breum.png');
    this.load.image('brmint', 'assets/brmint.png');

    this.load.image('boss', 'assets/boss.png');
    this.load.image('cleaner', 'assets/cleaner.png');
    this.load.image('npc', 'assets/npc.png');
    this.load.image('bossNpc', 'assets/bossNpc.png');
    this.load.image('galus', 'assets/galus.png');
    this.load.image('targetpos', 'assets/targetpos.png');
    this.load.image('bossHand', 'assets/bossHand.png');
    this.load.spritesheet('meso', 'assets/meso.png', { frameWidth: 25, frameHeight: 25 });

    this.load.image('starforce', 'assets/starforce.png');

    this.load.image('skillUse', 'assets/skillUse.png');
    this.load.audio('bossfight', 'assets/bossfight.mp3');
    this.load.audio('bosswaiting', 'assets/bosswaiting.mp3');
    this.load.audio('townsong', 'assets/town.mp3');

    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 54, frameHeight: 76 });

    this.createTransparentPixelTexture('default_pixel');
  }

  create() {
    this.scene.start('TownScene');
  }
}

export default BaseScene;
