import NPC from "@/components/phaser/npc/PhaserNPC";

class NPCManager {
  public npcList: NPC[] = [];

  constructor() { }

  // 맵 NPC 재설정
  public setNPCs(npcs: NPC[]) {
    this.npcList.forEach(npc => npc.destroy(true));
    this.npcList = npcs;
  }

  // NPC 삭제
  public removeNPCs(filter: ((_: NPC) => boolean)) {
    this.npcList.forEach(npc => {
      if (filter(npc)) {
        npc.destroy(true);
      }
    });
    this.npcList = this.npcList.filter(npc => npc !== undefined);
  }
}

export default NPCManager;
