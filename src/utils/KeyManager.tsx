export type KeyPressCallback = (event: KeyboardEvent) => void;

class KeyboardManager {
  private keyCallbacks: Map<string, Set<KeyPressCallback>> = new Map();
  private globalCallbacks: Set<KeyPressCallback> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyDown.bind(this));
      // window.addEventListener('keyup', this.handleKeyUp.bind(this));
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    if (this.keyCallbacks.has(key)) {
      this.keyCallbacks.get(key)!.forEach(callback => callback(event));
    }
    this.globalCallbacks.forEach(callback => callback(event));
  }

  public onKeyDown(key: string, callback: KeyPressCallback) {
    const lowerCaseKey = key.toLowerCase();
    if (!this.keyCallbacks.has(lowerCaseKey)) {
      this.keyCallbacks.set(lowerCaseKey, new Set());
    }
    this.keyCallbacks.get(lowerCaseKey)!.add(callback);
  }

  public offKeyDown(key: string, callback: KeyPressCallback) {
    const lowerCaseKey = key.toLowerCase();
    if (this.keyCallbacks.has(lowerCaseKey)) {
      this.keyCallbacks.get(lowerCaseKey)!.delete(callback);
      if (this.keyCallbacks.get(lowerCaseKey)!.size === 0) {
        this.keyCallbacks.delete(lowerCaseKey);
      }
    }
  }

  public onGlobalKeyDown(callback: KeyPressCallback) {
    this.globalCallbacks.add(callback);
  }

  public offGlobalKeyDown(callback: KeyPressCallback) {
    this.globalCallbacks.delete(callback);
  }
}

const keyboardManager = new KeyboardManager();
export default keyboardManager;
