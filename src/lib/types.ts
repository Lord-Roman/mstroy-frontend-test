export type guid = string | number;

export interface ITreeItem {
  id: guid;
  parent: string | number | null;
  [key: string]: any;
}
