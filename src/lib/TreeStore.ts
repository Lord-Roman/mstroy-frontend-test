export type guid = string | number;

interface ITreeItem {
  id: guid;
  parent: string | number | null;
  [key: string]: any;
}

interface IFullTreeItem extends ITreeItem {
    children: guid[] // Массив id всех детей
}

export class TreeStore {
    items:Map<guid, IFullTreeItem> = new Map();

    constructor(tree: ITreeItem[]){
        const children:Map<guid, guid[]> = new Map();
        tree.forEach( (node : ITreeItem) => {
            this.items.set(node.id, {...node, children : children.get(node.id) ?? []}); //Формируем наш Map(). Дополнительнное поле children может быть пустым, но заполниться дальше
            children.delete(node.id); //Это значение мы уже использовать не будем
            
            const parentId = node.parent
            if(parentId) {
                if(this.items.has(parentId)){
                    this.items.get(parentId)!.children.push(node.id)
                }else{
                    children.has(parentId) ? children.get(parentId)?.push(node.id) : children.set(parentId,[])
                }
            }
        });
    }

    getAll(){ //Возвращает изначальный массив элементов.
        return Array.from(this.items.values()).map(({ children, ...rest }) => rest);
    }

    getItem(id:guid) { //Принимает id элемента и возвращает сам объект элемента.
        const item = this.items.get(id);
        if (!item) return undefined;

        const { children, ...rest } = item;
        return rest;
    }
    getChildrenArray(id: guid){
        return this.items.get(id)?.children;
    }

    getChildren(id: guid){
        const children = this.getChildrenArray(id);
        if(!children?.length) return []
        
        return children?.map(child => this.getItem(child))

        //  Принимает id элемента и возвращает массив элементов,
        // являющихся дочерними для того элемента, чей id получен в аргументе. Если у
        // элемента нет дочерних, то должен возвращаться пустой массив.
    }

    getAllChildren(id:guid) {


        
        return id
    }
    // - Принимает id элемента и возвращает массив элементов,
// являющихся прямыми дочерними элементами того, чей id получен в аргументе +
// если у них в свою очередь есть еще дочерние элементы, они все тоже будут
// включены в результат и так до самого глубокого уровня.
 getAllParents(id:guid) {
    return id
 }// - Принимает id элемента и возвращает массив из цепочки
// родительских элементов, начиная от самого элемента, чей id был передан в
// аргументе и до корневого элемента, т.е. должен получиться путь элемента
// наверх дерева через цепочку родителей к корню дерева
addItem(item:ITreeItem){
    return item 
}
// - Принимает объект нового элемента и добавляет его в общую
// структуру хранилища.
removeItem(id:guid):void {
    console.log(id)
}// - Принимает id элемента и удаляет соответствующий элемент и
// все его дочерние элементы из хранилища.
updateItem(item:ITreeItem) {
    console.log(item)
} //Принимает объект обновленного айтема и актуализирует этот айтем в хранилище.

}