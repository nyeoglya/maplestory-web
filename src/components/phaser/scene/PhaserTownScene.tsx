import gameManager from "@/utils/manager/GameManager";
import PhaserPlayer from "../PhaserPlayer";
import { Skill } from "@/utils/Skill";
import { getOverlapEntity } from "@/utils/Utils";
import TeleportPad from "../etc/PhaserTeleportPad";

class TownScene extends Phaser.Scene {
  private player: PhaserPlayer | null = null;
  private platforms: Phaser.Physics.Arcade.StaticGroup | null = null;
  private teleportPadList: TeleportPad[] = [];
  private bgm!: Phaser.Sound.BaseSound;

  constructor() {
    super('TownScene');
  }

  create() {
    this.bgm = this.sound.add('townsong', {
      loop: true,
      volume: 0.3
    });
    this.bgm.play();
    this.events.on('shutdown', () => {
      this.bgm.stop();
    });

    this.input.setDefaultCursor('url(assets/point.cur), pointer'); // 메이플 마우스 포인터
    this.input.on('pointerdown', () => {
      this.input.setDefaultCursor('url(assets/point_low.cur), pointer');
    });
    this.input.on('pointerup', () => {
      this.input.setDefaultCursor('url(assets/point.cur), pointer');
    });

    gameManager.gameHeight = 800; // this.sys.game.config.height as number
    const image = this.textures.get('townMap').getSourceImage() as HTMLImageElement;
    const scale = gameManager.gameHeight / image.height;
    gameManager.gameWidth = image.width * scale;
    this.physics.world.setBounds(0, 0, gameManager.gameWidth, gameManager.gameHeight);

    const sky = this.add.image(0, 0, 'townMap').setOrigin(0, 0);
    sky.setScale(this.physics.world.bounds.width / sky.width, this.physics.world.bounds.height / sky.height);

    this.cameras.main.setZoom(1.5); // 카메라 줌
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // 플랫폼 생성
    this.platforms = this.physics.add.staticGroup();
    (this.platforms.create(0, this.physics.world.bounds.height - 110, 'default_pixel') as Phaser.Physics.Arcade.Sprite)
      .setOrigin(0, 0)
      .setScale(this.physics.world.bounds.width, 10)
      .refreshBody();

    // 발판 생성
    this.teleportPadList.push(
      new TeleportPad(this, { x: 800, y: this.physics.world.bounds.height - 125 }, 'WaitingScene')
    );

    // 플레이어 생성
    this.player = new PhaserPlayer(this, 500, this.physics.world.bounds.height - 200, 'player');
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
    const player = this.player;
    player.update();

    if (!player.body) return;
    const playerBody = player.body;
    if (this.teleportPadList.length !== 0) {
      this.teleportPadList.forEach((teleportPad: TeleportPad) => {
        let overlapped = false;
        this.physics.overlap(playerBody, teleportPad, () => {
          overlapped = true;
          player.teleportLoc = teleportPad.teleportLoc;
        }, undefined, this);
        if (!overlapped) player.teleportLoc = null;
      });
    }
  }
}

export default TownScene;
