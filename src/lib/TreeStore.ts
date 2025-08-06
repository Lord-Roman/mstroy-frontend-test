import type { guid, ITreeItem } from "./types";

interface IFullTreeItem extends ITreeItem {
  children: guid[]; // Массив id всех детей
}

export class TreeStore {
  private items: Map<guid, IFullTreeItem> = new Map();

  constructor(tree: ITreeItem[]) {
    const children: Map<guid, guid[]> = new Map();
    tree.forEach((item: ITreeItem) => {
      this.items.set(item.id, {
        ...item,
        children: children.get(item.id) ?? [],
      }); //Формируем наш Map(). Дополнительнное поле children может быть пустым, но заполниться дальше
      children.delete(item.id); //Это значение мы уже использовать не будем

      const parentId = item.parent;
      if (parentId) {
        // Если вообще есть id родителя.
        if (this.items.has(parentId)) {
          // Если родитель уже добавлен
          this.items.get(parentId)!.children.push(item.id); // добавляем родителю ещё ребёнка
        } else {
          children.has(parentId)
            ? children.get(parentId)?.push(item.id) // добавляем в существующий массив ребёнка
            : children.set(parentId, [item.id]); // создаём массив и добавляем ребёнка
        }
      }
    });
  }

  getAll() {
    return Array.from(this.items.values()).map(({ children, ...rest }) => rest);
    //Возвращает изначальный массив элементов.
  }

  getItem(id: guid): ITreeItem | undefined {
    const item = this.items.get(id);
    if (!item) return undefined;

    const { children, ...rest } = item;
    return rest;
    //Принимает id элемента и возвращает сам объект элемента.
  }
  getChildrenIds(id: guid) {
    return this.items.get(id)?.children;

    // Принимает id элемента и возвращает массив состоящий из Id,
    // дочерних элементов для того элемента, чей id получен в аргументе.
  }

  getChildren(id: guid): ITreeItem[] | [] {
    const childrenIds = this.getChildrenIds(id);
    if (!childrenIds?.length) return [];

    return childrenIds.flatMap((id) => {
      const item = this.getItem(id);
      return item ? [item] : [];
    });

    // Принимает id элемента и возвращает массив элементов,
    // являющихся дочерними для того элемента, чей id получен в аргументе. Если у
    // элемента нет дочерних, то должен возвращаться пустой массив.
  }

  getAllChildren(id: guid): ITreeItem[] {
    const result: ITreeItem[] = [];
    const stack: (string | number)[] = [id];

    while (stack.length > 0) {
      const currentId = stack.pop()!;
      const children = this.getChildren(currentId);

      for (const child of children) {
        result.push(child);
        stack.push(child.id);
      }
    }

    return result;
    // - Принимает id элемента и возвращает массив элементов,
    // являющихся прямыми дочерними элементами того, чей id получен в аргументе +
    // если у них в свою очередь есть еще дочерние элементы, они все тоже будут
    // включены в результат и так до самого глубокого уровня.
  }

  getAllParents(id: guid): ITreeItem[] | [] {
    const self = this.getItem(id);
    if (!self) return [];

    const result = [self];
    let parentId = self?.parent;

    while (parentId) {
      let item = this.getItem(parentId);
      if (item) {
        result.push(item);
        parentId = item?.parent;
      }
    }

    return result;
    // Принимает id элемента и возвращает массив из цепочки
    // родительских элементов, начиная от самого элемента, чей id был передан в
    // аргументе и до корневого элемента, т.е. должен получиться путь элемента
    // наверх дерева через цепочку родителей к корню дерева
  }

  addItem(item: ITreeItem) {
    this.items.set(item.id, { ...item, children: [] });
    if (item.parent) {
      this.items.get(item.parent)?.children.push(item.id);
    }
    // Принимает объект нового элемента и добавляет его в общую
    // структуру хранилища.
  }

  removeItem(id: guid): void {
    if (!this.items.has(id)) {
      return;
    }
    this.getAllChildren(id).forEach((child) => this.removeItem(child.id));
    const parentId = this.items.get(id)?.parent;
    this.items.delete(id);

    if (parentId) {
      const index = this.items
        .get(parentId)
        ?.children.findIndex((item) => item === id);
      this.items.get(parentId)?.children.splice(1, index);
    }

    // Принимает id элемента и удаляет соответствующий элемент и
    // все его дочерние элементы из хранилища
  }

  updateItem(item: ITreeItem) {
    const children = this.items.get(item.id)?.children as guid[];
    this.items.set(item.id, { ...item, children });
    //Принимает объект обновленного айтема и актуализирует этот айтем в хранилище.
  }
}
