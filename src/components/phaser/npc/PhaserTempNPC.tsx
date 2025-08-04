import { v4 as uuidv4 } from 'uuid';
import { Vector } from "matter";
import NPC from "./PhaserNPC";
import Dialog from "@/utils/Dialog";

const tempDialog = new Dialog(
  null,
  [{ name: null, msg: "hi" }],
  () => null
);

class NPCTemp extends NPC {

  public onInteractStart() {
    this.isInteracting = true;
  }

  public onInteracting() {

  }

  public onInteractEnd() {
    this.isInteracting = false;
  }

  constructor(
    public scene: Phaser.Scene,
    protected currentPos: Vector,
    protected dialog: Dialog = tempDialog,
    public texture: string = 'npc',
    public affectGravity: boolean = true,
    public name: string = '',
    public uuid: string = uuidv4(),
  ) {
    super(scene, currentPos, dialog, texture, affectGravity, name, uuid);
  }
}

export default NPCTemp;
