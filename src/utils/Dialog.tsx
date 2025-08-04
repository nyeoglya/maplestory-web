interface SingleMessage {
  name: string | null,
  msg: string,
}

class Dialog {
  protected currentDialogIndicator: number = 0;

  constructor(
    public backgroundImg: string | null,
    public dialog: SingleMessage[] = [],
    public onDialogEnd: () => null,
  ) { }

  public resetDialog() {
    this.currentDialogIndicator = 0;
  }

  public getNextDialog(): SingleMessage | null {
    if (this.currentDialogIndicator == this.dialog.length - 1) {
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
