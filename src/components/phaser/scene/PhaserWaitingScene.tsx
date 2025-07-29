import gameManager from "@/utils/manager/GameManager";
import PhaserPlayer from "../PhaserPlayer";
import { Skill } from "@/utils/Skill";
import { getOverlapEntity } from "@/utils/Utils";

class WaitingScene extends Phaser.Scene {
  private player: PhaserPlayer | null = null;
  private platforms: Phaser.Physics.Arcade.StaticGroup | null = null;
  private teleportPads: Phaser.Physics.Arcade.StaticGroup | null = null;
  private teleportLoc: string = 'BossScene';
  private bgm!: Phaser.Sound.BaseSound;

  constructor() {
    super('WaitingScene');
  }

  create() {
    /*
    this.bgm = this.sound.add('musicTestA', {
      loop: false,
      volume: 0.5
    });

    this.bgm.play();
    */

    gameManager.gameHeight = 800; // this.sys.game.config.height as number
    const image = this.textures.get('waitingMap').getSourceImage() as HTMLImageElement;
    const scale = gameManager.gameHeight / image.height;
    gameManager.gameWidth = image.width * scale;
    this.physics.world.setBounds(0, 0, gameManager.gameWidth, gameManager.gameHeight);

    const sky = this.add.image(0, 0, 'waitingMap').setOrigin(0, 0);
    sky.setScale(this.physics.world.bounds.width / sky.width, this.physics.world.bounds.height / sky.height);

    this.cameras.main.setZoom(1.5); // 카메라 줌

    // 플랫폼 생성
    this.platforms = this.physics.add.staticGroup();
    (this.platforms.create(0, this.physics.world.bounds.height - 130, 'default_pixel') as Phaser.Physics.Arcade.Sprite)
      .setOrigin(0, 0)
      .setScale(this.physics.world.bounds.width, 10)
      .refreshBody();

    // 발판 생성
    this.teleportPads = this.physics.add.staticGroup();
    (this.teleportPads.create(1150, this.physics.world.bounds.height - 150, 'default_pixel') as Phaser.Physics.Arcade.Sprite)
      .setOrigin(0, 0)
      .setScale(120, 20)
      .refreshBody();

    // 플레이어 생성
    this.player = new PhaserPlayer(this, 100, this.physics.world.bounds.height - 400, 'player');
    gameManager.phaserPlayer = this.player;

    // 플레이어 충돌 설정
    if (this.player && this.platforms) {
      this.physics.add.collider(this.player, this.platforms);
    }

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
        if (skill.skillImgPath) {
          this.player.showSkillImg(skill.skillImgPath);
        }
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

    if (!this.player.body || !this.teleportPads) return;
    // val isCollideTeleportPads = false; // TODO: 발판에 닿아있지 않을 때는 텔레포트가 되면 안됨.
    this.physics.overlap(this.player.body, this.teleportPads, () => {
      if (this.player) this.player.teleportLoc = this.teleportLoc;
    }, undefined, this);
  }
}

export default WaitingScene;
