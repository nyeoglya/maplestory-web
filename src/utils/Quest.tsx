import { Item } from "./Item";
import { PlayerStat } from "./Utils";

class Quest {
  constructor(
    public questTitle: string,
    public questDescription: string,
    public questCondition: (playerStat: PlayerStat) => boolean,
    public questCompensation: Item,
  ) {

  }
}

export default Quest;
