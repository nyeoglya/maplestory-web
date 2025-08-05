import { v4 as uuidv4 } from 'uuid';
import { Vector } from "matter";
import NPC from "./PhaserNPC";
import Dialog from "@/utils/Dialog";
import Quest from '@/utils/Quest';
import { ItemTestA } from '@/utils/Item';
import gameManager from '@/utils/manager/GameManager';

const tempQuestComplete = (): boolean => {
  gameManager.inventoryManager.itemCount(ItemTestA);
  return false;
};

const tempQuest = new Quest(
  '퀘스트 테스트',
  '테스트이다.',
  tempQuestComplete,
  new ItemTestA(),
)

const giveTempQuest = () => {
  if (!gameManager.questManager.hasQuest(tempQuest)) {
    gameManager.questManager.addQuest(tempQuest);
  }
};

const tempDialog = new Dialog(
  '/assets/npc.png',
  [
    { name: "강원기", msg: "용사님. 안녕하세요? 저는 메이플스토리 디렉터 강원기라고 합니다." },
    { name: "강원기", msg: "퀘스트를 받으시겠습니까? (미완성임)" },
  ],
  giveTempQuest,
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
