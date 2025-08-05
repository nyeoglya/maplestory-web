import { Item } from "./Item";

class Quest {
  constructor(
    public questTitle: string,
    public questDescription: string,
    public questCondition: () => boolean,
    public questCompensation: Item,
  ) {

  }
}

export default Quest;
