import { Project } from '../types/canvas';

class ProjectHistory {
  private past: Project[] = [];
  private future: Project[] = [];
  private limit = 30;

  push(project: Project) {
    const clone = JSON.parse(JSON.stringify(project));
    this.past.push(clone);
    if (this.past.length > this.limit) {
      this.past.shift();
    }
    this.future = [];
  }

  undo(current: Project): Project | null {
    if (this.past.length === 0) return null;
    const previous = this.past.pop()!;
    this.future.unshift(JSON.parse(JSON.stringify(current)));
    return previous;
  }

  redo(current: Project): Project | null {
    if (this.future.length === 0) return null;
    const next = this.future.shift()!;
    this.past.push(JSON.parse(JSON.stringify(current)));
    return next;
  }

  canUndo(): boolean {
    return this.past.length > 0;
  }

  canRedo(): boolean {
    return this.future.length > 0;
  }

  clear() {
    this.past = [];
    this.future = [];
  }
}

export const historyManager = new ProjectHistory();
