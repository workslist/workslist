// Создаём и возвращаем заголовок приложения      __________ЕСТЬ____________
function createAppTitle (title) {
    let appTitle = document.createElement ('h2'); // Создаём переменную, в которую помещаем заголовок H2
    appTitle.innerHTML = title; // Присваиваем свойству title, который передаём в качестве аргумента функции. innerHTML -  заменяет содержимое appTitle на title.
    return appTitle; // Возвращаем элемент, который создали
}

// Создаём и возвращам форму для создания тела       __________ЕСТЬ____________
function createTodoItemForm () {
    let form = document.createElement ('form'); // Создаём элемент формы 
    let input = document.createElement ('input'); // Создаём поле для ввода
    let buttonWrapper = document.createElement ('div'); // Создаём вспомогательный элемент для стилизации кнопки
    let button = document.createElement ('button'); // Создаём кнопку

    // Расставляем атрибуты для элементов
    form.classList.add ('input-group', 'mb-3'); // Присваиваем классы
    input.classList.add ('form-control'); // Присваиваем классы
    input.placeholder = 'Введите название нового дела'; // Выводим placeholder для поля ввода
    buttonWrapper.classList.add ('input-group-append'); // Присваиваем классы
    button.classList.add ('btn', 'btn-primary'); // Присваиваем классы
    button.textContent = 'Добавить дело'; // Выводим текст кнопки

    // Объединяем элементы
    buttonWrapper.append(button); // Кнопку вкладываем в div
    form.append(input); // ПОле ввода вкладываем в форм
    form.append(buttonWrapper); // Див с кнопкой вкладываем в форму

    // Возвращаем результат
    return {
        form,
        input,
        button
    };
}

// создаём и возвращаем список элементов
function createTodoList () {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
}

function createTodoItemElement( todoItem, { onDone, onDelete }, owner) { 
    const doneClass = 'list-group-item-success';

    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

    if (todoItem.done) {
        item.classList.add(doneClass);
    }
    item.textContent = todoItem.name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    doneButton.addEventListener('click', function() {
        onDone({ todoItem, element: item }, owner);
        item.classList.toggle(doneClass, todoItem.done);
    });

    deleteButton.addEventListener('click', function() {
        onDelete({ todoItem, element: item }, owner)
    });

    // Вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return item;
}

//  __________ЕСТЬ___________

function createTodoApp(container, {
    title,
    owner,
    todoItemList = [],
    onCreateFormSubmit, // Создание нового дела
    onDoneClick,
    onDeleteClick,
}) {
    // Вызываем поочерёдно функции, которые создали до этого
    const todoAppTitle = createAppTitle(title); // Заголовок
    const todoItemForm = createTodoItemForm(); // Форма
    const todoList = createTodoList(); // Список элементов
    const handlers = {  onDone: onDoneClick, onDelete: onDeleteClick };
    
    // Размещаем их результат внутри контэйнера
    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    todoItemList.forEach(todoItem => {                                              
        const todoItemElement = createTodoItemElement(todoItem, handlers, owner);
        todoList.append(todoItemElement);
    });

    // for (const todoItem of todoItemList) {
    //     const todoItemElement = createTodoItemElement(todoItem, handlers, owner);
    //     todoList.append(todoItemElement);
    // }

    todoItemForm.form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Игнорируем создание элемента, если пользователь ничего не ввёл в поле
        if (!todoItemForm.input.value) {
            return;
        };

        // Вызываем функцию создания нового дела
        let todoItem = onCreateFormSubmit ({
            owner,
            name: todoItemForm.input.value.trim(),
            done: false,
        })

        const todoItemElement = createTodoItemElement(todoItem, handlers);

        todoList.append(todoItemElement);

        // Очищаем поле после отправки
        todoItemForm.input.value = '';

    });
}

export { createTodoApp };

