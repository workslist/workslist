
let listArray = [];

const sampleTodoItems = {
    'Я': [
        { id: 'sample-me-1', name: 'Разобрать почту', done: false },
        { id: 'sample-me-2', name: 'Подготовить список покупок', done: false },
        { id: 'sample-me-3', name: 'Оплатить интернет', done: true },
        { id: 'sample-me-4', name: 'Позвонить', done: false },
        { id: 'sample-me-5', name: 'Навести порядок на рабочем столе', done: false },
    ],
    dad: [
        { id: 'sample-dad-1', name: 'Проверить уровень масла в машине', done: false },
        { id: 'sample-dad-2', name: 'Забрать посылку', done: false },
        { id: 'sample-dad-3', name: 'Съездить в хозяйственный магазин', done: true },
        { id: 'sample-dad-4', name: 'Записаться на техосмотр', done: false },
        { id: 'sample-dad-5', name: 'Полить растения на балконе', done: false },
    ],
    mom: [
        { id: 'sample-mom-1', name: 'Запланировать семейный ужин', done: false },
        { id: 'sample-mom-2', name: 'Купить семена для дачи', done: false },
        { id: 'sample-mom-3', name: 'Разобрать сезонную одежду', done: true },
        { id: 'sample-mom-4', name: 'Записаться к стоматологу', done: false },
        { id: 'sample-mom-5', name: 'Подготовить список дел на месяц', done: false },
    ],
};

export function getTodoList(owner) {

    let localData = localStorage.getItem(owner);

    if (localData !== null) {
        listArray = JSON.parse(localData);
    } else {
        listArray = sampleTodoItems[owner] ? [...sampleTodoItems[owner]] : [];
        saveList(listArray, owner);
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

