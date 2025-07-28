import React from 'react';
import { Vector } from 'matter';

interface WindowData {
  id: string;
  pos: Vector; // lefttop position
  posRef: React.RefObject<Vector>;
  setPos: React.Dispatch<React.SetStateAction<Vector>>;
  isDragging: React.RefObject<boolean>;
  offset: React.RefObject<Vector>;
  width: number;
  height: number;
  showWindow: boolean;
  setZIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
}

class WindowManager {
  public windowList: WindowData[] = [];
  public currentWindowId: string | undefined = undefined;
  public currentWindow: WindowData | undefined = undefined;
  private baseZIndex: number = 999;

  // 윈도우를 추가
  public addWindow(data: WindowData) {
    this.windowList.push(data);
    console.log(this.windowList);
  }

  // 특정 윈도우를 모든 윈도우 기준 최상단으로 이동
  public makeTop(winId: string) {
    const targetIndex = this.windowList.findIndex(win => win.id === winId);
    if (targetIndex === -1) return;

    const targetWindow = this.windowList[targetIndex];

    this.windowList.splice(targetIndex, 1);
    this.windowList.unshift(targetWindow);

    this.windowList.forEach((win, index) => {
      win.setZIndex(this.baseZIndex + (this.windowList.length - 1 - index));
    });
  }

  // 현재 위치의 최상단 윈도우의 id를 반환
  public findWindow(pos: Vector): string | undefined {
    const window = this.windowList.find(item => {
      const wPos = item.posRef.current;
      return (
        wPos.x <= pos.x && pos.x <= wPos.x + item.width &&
        wPos.y <= pos.y && pos.y <= wPos.y + item.height
      );
    });
    return window?.id;
  }

  // id로 윈도우 찾기
  public getWindow(winId: string): WindowData | undefined {
    return this.windowList.find(item => item.id == winId);
  }

  public handleMouseDown = (e: React.MouseEvent) => {
    this.currentWindowId = this.findWindow({ x: e.clientX, y: e.clientY });
    if (this.currentWindowId == undefined) return;

    this.makeTop(this.currentWindowId);

    this.currentWindow = this.getWindow(this.currentWindowId);
    if (this.currentWindow == undefined) return;

    this.currentWindow.isDragging.current = true;
    this.currentWindow.offset.current = {
      x: e.clientX - this.currentWindow.posRef.current.x,
      y: e.clientY - this.currentWindow.posRef.current.y,
    };

    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  };

  // 윈도우의 위치를 재지정
  public setWindowPosition(winId: string, newPos: Vector) {
    const window = this.getWindow(winId);
    if (!window) return
    window.posRef.current = newPos;
    window.setPos(window.posRef.current);
  }

  // 마우스 이동을 윈도우 위치에 적용
  public handleMouseMove = (e: MouseEvent) => {
    if (this.currentWindowId == undefined || this.currentWindow == undefined) return;
    if (!this.currentWindow.isDragging.current) return;

    const newX = e.clientX - this.currentWindow.offset.current.x;
    const newY = e.clientY - this.currentWindow.offset.current.y;

    const newPos = { x: newX, y: newY };
    this.currentWindow.posRef.current = newPos;
    this.currentWindow.setPos(this.currentWindow.posRef.current);
  };

  public handleMouseUp = () => {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  };
}

const windowManager: WindowManager = new WindowManager();

export default windowManager;
