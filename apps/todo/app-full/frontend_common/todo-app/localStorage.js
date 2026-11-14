
let listArray = [];

export function getTodoList(owner) {

    let localData = localStorage.getItem(owner);

    if (localData !== null && localData !== '') {
        listArray = JSON.parse(localData);
    }

    return listArray;
}

function saveList(arr, keyName) {
    localStorage.setItem(keyName, JSON.stringify(arr)); // Записываем в локалсторэдж массив в виде строки с данными списка
}



export function createTodoItem({ owner, name, done }) {
    let newItem = { // Создаём переменную, которая будет хранить в себе уникальный id, объект с делом и статусом выполнения 
        id: Math.round(Math.random() * 1000),
        name,
        done,
    }
    listArray.push(newItem);
    saveList(listArray, owner);

    return newItem
}

export function switchTodoItemDone({ todoItem }, owner) {

    for ( const listItem of listArray) {
        if (listItem.id === todoItem.id) {
            listItem.done = !listItem.done;
        }
    }

    saveList(listArray, owner); // Сохранение при изменении статуса дела
}

export function deleteTodoItem({ element, todoItem }, owner) {
    if (!confirm('Вы уверены?')) {
        return;
    }
    element.remove();

    for (let i = 0; i < listArray.length; i++) {
        if ( listArray[i].id === todoItem.id ) {
            listArray.splice (i, 1) // splise - удаляет элементы
        }
    }

    saveList(listArray, owner);
}

