import Quest from "../Quest";

class QuestManager {

  public completedQuestList: Quest[] = [];
  public currentQuestList: Quest[] = [];

  constructor() {

  }

  // 새로운 퀘스트를 할당
  public addQuest() {

  }

  // 완료된 퀘스트를 확인
  protected checkCompletedQuest() {

  }
}

const questManager = new QuestManager();

export default questManager;
