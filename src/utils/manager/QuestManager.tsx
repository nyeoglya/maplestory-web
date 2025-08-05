import Quest from "../Quest";
import gameManager from "./GameManager";

class QuestManager {

  public completedQuestList: Quest[] = [];
  public currentQuestList: Quest[] = [];

  constructor() { }

  public setCurrentQuest: ((value: Quest[]) => void) | undefined = undefined;

  // 새로운 퀘스트를 할당
  public addQuest(newQuest: Quest) {
    this.currentQuestList.push(newQuest);
  }

  // 퀘스트가 이미 할당된 것인지 확인
  public hasQuest(quest: Quest) {
    for (const completedQuest of this.completedQuestList) {
      if (quest.questTitle === completedQuest.questTitle) return true;
    }
    for (const currentQuest of this.currentQuestList) {
      if (quest.questTitle === currentQuest.questTitle) return true;
    }
    return false;
  }

  // 완료된 퀘스트를 확인
  protected checkCompletedQuest() {
    const checkedQuestList: Quest[] = [];
    for (const currentQuest of this.currentQuestList) {
      if (currentQuest.questCondition()) {
        checkedQuestList.push(currentQuest);
        gameManager.inventoryManager.addItemToInventory(currentQuest.questCompensation);
        this.completedQuestList.push(currentQuest);
      }
    }
    this.currentQuestList = this.currentQuestList.filter((quest: Quest) =>
      !checkedQuestList.find((q: Quest) => q.questTitle === quest.questTitle)
    );
  }
}

export default QuestManager;
