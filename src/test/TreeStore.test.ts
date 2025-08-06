import { describe, it, expect, beforeEach } from "vitest";
import { TreeStore } from "../lib/TreeStore";
import type { ITreeItem } from "../lib/types";

const tree: ITreeItem[] = [
  { id: 1, parent: null, name: "root" },
  { id: 2, parent: 1, name: "child 1" },
  { id: 3, parent: 1, name: "child 2" },
  { id: 4, parent: 2, name: "child 1.1" },
  { id: 5, parent: 2, name: "child 1.2" },
];

describe("TreeStore", () => {
  let store: TreeStore;

  beforeEach(() => {
    store = new TreeStore(tree);
  });

  it("should return all items with getAll", () => {
    const all = store.getAll();
    expect(all.length).toBe(5);
    expect(all.find((i) => i.id === 1)?.name).toBe("root");
  });

  it("should return a specific item with getItem", () => {
    const item = store.getItem(2);
    expect(item?.name).toBe("child 1");
  });

  it("should return children ids", () => {
    const childrenIds = store.getChildrenIds(2);
    expect(childrenIds).toEqual([4, 5]);
  });

  it("should return children items", () => {
    const children = store.getChildren(2);
    expect(children.map((i) => i.id)).toEqual([4, 5]);
  });

  it("should return all children recursively", () => {
    const allChildren = store.getAllChildren(1);
    expect(allChildren.map((i) => i.id).sort()).toEqual([2, 3, 4, 5]);
  });

  it("should return all parents up to root", () => {
    const allParents = store.getAllParents(5);
    expect(allParents.map((i) => i.id)).toEqual([5, 2, 1]);
  });

  it("should add a new item", () => {
    store.addItem({ id: 6, parent: 3, name: "new child" });
    expect(store.getChildren(3).map((i) => i.id)).toContain(6);
  });

  it("should update an existing item", () => {
    store.updateItem({ id: 3, parent: 1, name: "updated" });
    expect(store.getItem(3)?.name).toBe("updated");
  });

  it("should remove an item and its children", () => {
    store.removeItem(2);
    expect(store.getItem(2)).toBeUndefined();
    expect(store.getItem(4)).toBeUndefined();
    expect(store.getItem(5)).toBeUndefined();
  });
});
