import gameManager from "@/utils/manager/GameManager";
import PhaserPlayer from "../PhaserPlayer";
import { Skill } from "@/utils/Skill";
import { getOverlapEntity } from "@/utils/Utils";
import DirectionalPlatform from "../etc/PhaserDirectionalPlatform";
import NPCBossEnter from "../npc/PhaserBossEnterNPC";

class WaitingScene extends Phaser.Scene {
  private player: PhaserPlayer | null = null;
  private platforms: Phaser.Physics.Arcade.StaticGroup | null = null;
  private bgm!: Phaser.Sound.BaseSound;

  constructor() {
    super('WaitingScene');
  }

  create() {
    this.bgm = this.sound.add('bosswaiting', {
      loop: true,
      volume: 0.3,
    });
    gameManager.backgroundBGM = this.bgm;
    this.bgm.play();
    this.events.on('shutdown', () => {
      this.bgm.stop();
      gameManager.backgroundBGM = undefined;
    });

    this.input.setDefaultCursor('url(assets/point.cur), pointer'); // 메이플 마우스 포인터
    this.input.on('pointerdown', () => {
      this.input.setDefaultCursor('url(assets/point_low.cur), pointer');
    });
    this.input.on('pointerup', () => {
      this.input.setDefaultCursor('url(assets/point.cur), pointer');
    });

    gameManager.gameHeight = 800; // this.sys.game.config.height as number
    const image = this.textures.get('waitingMap').getSourceImage() as HTMLImageElement;
    const scale = gameManager.gameHeight / image.height;
    gameManager.gameWidth = image.width * scale;
    this.physics.world.setBounds(0, 0, gameManager.gameWidth, gameManager.gameHeight);

    const sky = this.add.image(0, 0, 'waitingMap').setOrigin(0, 0);
    sky.setScale(this.physics.world.bounds.width / sky.width, this.physics.world.bounds.height / sky.height);

    this.cameras.main.setZoom(1.5); // 카메라 줌
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // 플랫폼 생성
    this.platforms = this.physics.add.staticGroup();
    (this.platforms.create(0, this.physics.world.bounds.height - 110, 'default_pixel') as Phaser.Physics.Arcade.Sprite)
      .setOrigin(0, 0)
      .setScale(this.physics.world.bounds.width, 10)
      .refreshBody();

    const bossEnterNPC = new NPCBossEnter(this, { x: 850, y: this.physics.world.bounds.height - 400 });
    gameManager.npcManager.setNPCs([bossEnterNPC]);

    // 플레이어 생성
    this.player = new PhaserPlayer(this, 100, this.physics.world.bounds.height - 400, 'player');
    gameManager.phaserPlayer = this.player;

    // 플레이어 충돌 설정
    if (this.player && this.platforms) {
      this.physics.add.collider(this.player, this.platforms);
    }

    // 단방향 플랫폼
    this.player.directionalPlatformList = [
      new DirectionalPlatform(this, { x: 480, y: this.physics.world.bounds.height - 150 }, this.player, null, 230),
      new DirectionalPlatform(this, { x: 520, y: this.physics.world.bounds.height - 200 }, this.player, null, 230),
      new DirectionalPlatform(this, { x: 570, y: this.physics.world.bounds.height - 250 }, this.player, null, 230),
      new DirectionalPlatform(this, { x: 630, y: this.physics.world.bounds.height - 300 }, this.player, null, 230),
      new DirectionalPlatform(this, { x: 670, y: this.physics.world.bounds.height - 350 }, this.player, null, 400),
      new DirectionalPlatform(this, { x: 0, y: this.physics.world.bounds.height - 350 }, this.player, null, 290),
    ];

    // 스킬 키 매핑
    gameManager.skillManager.skillKeyMap.forEach((skill: Skill, key: string) => {
      if (!this.input.keyboard) return;
      const keyButton = this.input.keyboard.addKey(key);
      keyButton.on('down', () => {
        console.log(this.player, this.player?.detectionZone);
        if (!this.player || !this.player.detectionZone) return;
        if (!skill.isSkillAvailable(gameManager.player) ||
          gameManager.skillManager.skillCooltimeMap.get(skill) !== undefined) return;
        const overlapEntityList = getOverlapEntity(this, this.player.detectionZone, gameManager.normalEntityManager.entityList);
        this.player.showSkillImg(skill.skillImgPath);
        const effectedPlayer = gameManager.effectManager.effectChain(gameManager.player);
        gameManager.skillManager.skillUse(skill, effectedPlayer, overlapEntityList);
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
  }

  update(): void {
    if (!this.player) return;
    this.player.update();
  }
}

export default WaitingScene;
