export type guid = string | number;

interface ITreeItem {
  id: guid;
  parent: string | number | null;
  [key: string]: any;
}

interface IFullTreeItem extends ITreeItem {
  children: guid[]; // Массив id всех детей
}

export class TreeStore {
  items: Map<guid, IFullTreeItem> = new Map();

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
        if (this.items.has(parentId)) {
          this.items.get(parentId)!.children.push(item.id);
        } else {
          children.has(parentId)
            ? children.get(parentId)?.push(item.id)
            : children.set(parentId, []);
        }
      }
    });
  }

  getAll() {
    //Возвращает изначальный массив элементов.
    return Array.from(this.items.values()).map(({ children, ...rest }) => rest);
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
    return item;
    // Принимает объект нового элемента и добавляет его в общую
    // структуру хранилища.
  }

  removeItem(id: guid): void {
    this.getAllChildren(id).forEach((child) => this.items.delete(child.id));
    this.items.delete(id);
  }

  updateItem(item: ITreeItem) {
    const children = this.items.get(item.id)?.children as guid[];
    this.items.set(item.id, { ...item, children });
    //Принимает объект обновленного айтема и актуализирует этот айтем в хранилище.
  }
}
