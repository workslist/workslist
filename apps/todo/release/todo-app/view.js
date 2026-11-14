// Создаём и возвращаем заголовок приложения
function createAppTitle (title) {
    let appTitle = document.createElement ('h2');
    appTitle.innerHTML = title;
    return appTitle;
}

// Создаём и возвращам форму для создания тела
function createTodoItemForm () {
    let form = document.createElement ('form');
    let input = document.createElement ('input');
    let buttonWrapper = document.createElement ('div');
    let button = document.createElement ('button');

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

// Создаём и возвращаем кнопку смены хранилища
function createButon(text) {
    const btn = document.createElement('button');
    btn.classList.add('btn', 'btn-primary', 'mb-3', 'mr-3');
    btn.textContent = text;
    return btn;
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

function createTodoApp(container, {
    title,
    owner,
    todoItemList = [],
    onCreateFormSubmit, // Создание нового дела
    onDoneClick,
    onDeleteClick,
    clickButton,
    objBtn,
}) {
    // Вызываем поочерёдно функции, которые создали до этого
    const todoAppTitle = createAppTitle(title); // Заголовок
    const todoItemForm = createTodoItemForm(); // Форма
    const todoList = createTodoList(); // Список элементов
    const handlers = {  onDone: onDoneClick, onDelete: onDeleteClick };
    const button = createButon(objBtn.text);

    // "https://crm.workslist.ru/download/crm_frontend _backend.zip" download="crm_frontend_backend"
    
    // Размещаем их результат внутри контэйнера
    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(button);
    container.append(todoList);

    button.addEventListener('click', function() {
        clickButton(objBtn);
        alert('Переключение на серверное хранилище')
        location.reload();
    });

    todoItemList.forEach(todoItem => {
        const todoItemElement = createTodoItemElement(todoItem, handlers, owner);
        todoList.append(todoItemElement);
    });

    todoItemForm.form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Игнорируем создание элемента, если пользователь ничего не ввёл в поле
        if (!todoItemForm.input.value) {
            return;
        };

        // Вызываем функцию создания нового дела
        const todoItem = await onCreateFormSubmit ({
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

