const pathLS = './todo-app/localStorage.js';
const pathSERV = './todo-app/api.js';
let path = pathLS;
let text = 'Перейти на серверное хранилище';
let togle = true;
const key = 'storage';

let clickBtn = {
    path: path,
    text: text,
    toggle: togle,
}

// Достать из ЛС
function getTodoList(owner) {

    let localData = localStorage.getItem(owner);

    if (localData !== null && localData !== '') {
        clickBtn = JSON.parse(localData);
    }

    return clickBtn;
}

// Записать в лс
function saveList(arr, keyName) {
    localStorage.setItem(keyName, JSON.stringify(arr)); // Записываем в локалсторэдж массив в виде строки с данными списка
}

// Смена значений объекта по клику
function getclickButton(obj) {
    // obj.toggle = !obj.toggle;

    if (obj.toggle) {
        obj.path = pathLS;
        obj.text = 'Перейти на серверное хранилище';
    } else {
        obj.path = pathSERV;
        obj.text = 'Перейти на локальное хранилище';
    }

    saveList(obj, key); 
    getTodoList(key);
    return obj;
}

getTodoList(key);

export { getclickButton,  clickBtn }
