import { v4 as uuidv4 } from 'uuid';
import { Vector } from "matter";
import NPC from "./PhaserNPC";
import Dialog from "@/utils/Dialog";
import gameManager from '@/utils/manager/GameManager';

class NPCBossEnter extends NPC {

  public onInteractStart() {
    this.isInteracting = true;
    if (!gameManager.toggleBossWindow) return;
    gameManager.toggleBossWindow(true);
  }

  public onInteracting() {

  }

  public onInteractEnd() {
    this.isInteracting = false;
  }

  public onClickInteract(pointer: Phaser.Input.Pointer) {
    if (!gameManager.toggleBossWindow) return;
    gameManager.toggleBossWindow(true);
  }

  constructor(
    public scene: Phaser.Scene,
    protected currentPos: Vector,
    protected dialog: Dialog | null = null,
    public texture: string = 'bossNpc',
    public affectGravity: boolean = false,
    public name: string = '웡키',
    public uuid: string = uuidv4(),
  ) {
    super(scene, currentPos, dialog, texture, affectGravity, name, uuid);
  }
}

export default NPCBossEnter;
