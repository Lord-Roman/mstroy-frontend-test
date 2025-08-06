import { TreeStore } from "./TreeStore";
import type { guid, ITreeItem } from "./types";

type ActionType = "add" | "remove" | "update";

interface Action {
  type: ActionType;
  item: ITreeItem; // для add/remove/update - объект, который добавляли/удаляли/обновляли
  previousItem?: ITreeItem; // для update - предыдущая версия объекта
}

export class UndoableTreeStore extends TreeStore {
  private undoStack: Action[] = [];
  private redoStack: Action[] = [];

  addItem(item: ITreeItem) {
    super.addItem(item);
    this.undoStack.push({ type: "add", item });
    this.redoStack = [];
  }

  removeItem(id: guid) {
    const removedItem = this.getItem(id);
    if (!removedItem) return;

    const allChildren = this.getAllChildren(id);
    const removedItems = [removedItem, ...allChildren];

    super.removeItem(id);

    removedItems.forEach((item) => {
      this.undoStack.push({ type: "remove", item });
    });
    this.redoStack = [];
  }

  updateItem(item: ITreeItem) {
    const oldItem = this.getItem(item.id);
    if (!oldItem) return;

    super.updateItem(item);

    this.undoStack.push({ type: "update", item, previousItem: oldItem });
    this.redoStack = [];
  }

  undo() {
    const action = this.undoStack.pop();
    if (!action) return;

    this.applyInverseAction(action);
    this.redoStack.push(action);
  }

  redo() {
    const action = this.redoStack.pop();
    if (!action) return;

    this.applyAction(action);
    this.undoStack.push(action);
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  private applyAction(action: Action) {
    switch (action.type) {
      case "add":
        super.addItem(action.item);
        break;
      case "remove":
        super.removeItem(action.item.id);
        break;
      case "update":
        super.updateItem(action.item);
        break;
    }
  }

  private applyInverseAction(action: Action) {
    switch (action.type) {
      case "add":
        super.removeItem(action.item.id);
        break;
      case "remove":
        super.addItem(action.item);
        break;
      case "update":
        if (action.previousItem) super.updateItem(action.previousItem);
        break;
    }
  }
}
