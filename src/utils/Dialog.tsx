export interface SingleMessage {
  name: string | null,
  msg: string,
}

export interface BranchMessage extends SingleMessage {
  branch: SingleMessage[],
}

class Dialog {
  protected currentDialogIndicator: number = 0;

  constructor(
    public backgroundImg: string | null,
    public dialog: SingleMessage[] = [],
    public onDialogEnd: () => null,
  ) { }

  // 대화 초기화
  public resetDialog() {
    this.currentDialogIndicator = 0;
  }

  public isDialogEnd() {
    return this.currentDialogIndicator >= this.dialog.length;
  }

  // 다음 대화 가져오기
  public getNextDialog(): SingleMessage | null {
    console.log(this.currentDialogIndicator, this.dialog);
    if (this.currentDialogIndicator == this.dialog.length) {
      this.onDialogEnd();
      return null;
    } else {
      const currentDialog = this.dialog[this.currentDialogIndicator];
      this.currentDialogIndicator += 1;
      return currentDialog;
    }
  }
}

export default Dialog;
