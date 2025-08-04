import { v4 as uuidv4 } from 'uuid';
import { Vector } from "matter";
import NPC from "./PhaserNPC";
import Dialog from "@/utils/Dialog";

const tempDialog = new Dialog(
  '/assets/npc.png',
  [
    { name: "강원기", msg: "안녕하세요? 저는 메이플스토리 디렉터 강원기라고 합니다." },
    { name: "강원기", msg: "괘씸한 놈들. 서버 닫아." },
  ],
  () => null
);

class NPCTemp extends NPC {

  public onInteractStart() {
    this.isInteracting = true;
    this.dialogStart();
  }

  public onInteracting() {

  }

  public onInteractEnd() {
    this.isInteracting = false;
  }

  public onClickInteract(pointer: Phaser.Input.Pointer): void {
    this.dialogStart();
  }

  constructor(
    public scene: Phaser.Scene,
    protected currentPos: Vector,
    protected dialog: Dialog = tempDialog,
    public texture: string = 'npc',
    public affectGravity: boolean = false,
    public name: string = '',
    public uuid: string = uuidv4(),
  ) {
    super(scene, currentPos, dialog, texture, affectGravity, name, uuid);
  }
}

export default NPCTemp;
