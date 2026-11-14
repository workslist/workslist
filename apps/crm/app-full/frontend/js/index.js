const SERVER_URL = 'http://localhost:3000',
    CONTACT_TYPES = ['Телефон', 'Email', 'VK', 'Другое'],
    WAIT_TIME_MS = 300,
    $search = document.getElementById('search-inp'),
    $table = document.getElementById("table"),
    $load = document.getElementById("load"),    
    $saveButton = document.createElement("button"),
    $saveButtonLoad = document.createElement("button"),
    $main = document.getElementById('main');

let listСlient = [],
    filterClient = [],
    searchValue = null,
    serverDataSearch = null,
    serverData = null,
    timeout = null,
    sortColumnFlag = 'idClient',
    sortDirFlag = true;

function normalizeClientContacts(client) {
    return {
        ...client,
        contacts: (client.contacts || []).filter(contact => CONTACT_TYPES.includes(contact.type)),
    };
}


// Получить массив с сервера
async function serverGetClient() {

    // вкл loader
    $table.classList.add('table-margin');
    $load.classList.add('container__load-on');

    let response = await fetch(SERVER_URL + '/api/clients', {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    })
    let data = await response.json();
    
    return data;
}

// Отправить запрос на получение массива, выкл loader
async function loadClient() {
    try {
        serverData = await serverGetClient();
    } catch (error) {
        console.log(error.name);
        console.log(error.message);
        
    } finally {
        $table.classList.remove('table-margin');
        $load.classList.remove('container__load-on');
        if (serverData) {
            listСlient = serverData.map(normalizeClientContacts);
        }
    }
}

await loadClient();

// Добавление нового клиента на сервер
async function serverAddClient(obj) {

    // вкл loader
    $saveButton.classList.add('form__button-off');
    $saveButtonLoad.classList.add('form__button-on');
    
    let response = await fetch(SERVER_URL + '/api/clients', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj),
    })

    let data = await response.json();

    return data;
}

// Получить клиента по ID
async function serverGetOneClient(id) {
    
    let response = await fetch(SERVER_URL + '/api/clients/' + id, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    })

    let data = await response.json();

    return normalizeClientContacts(data);
}

// изменить данные клиента
async function serverСhangeClient(id, obj) {

    $saveButton.classList.add('form__button-off');
    $saveButtonLoad.classList.add('form__button-on');

    let response = await fetch(SERVER_URL + '/api/clients/' + id, {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj),
    })

    let data = await response.json();

    return data;
}

// Удаление клиента с сервера
async function serverDeleteClient(id) {
    let response = await fetch(SERVER_URL + '/api/clients/' + id, {
        method: "DELETE",
    })

    let data = await response.json()

    return data
}

// Массив, объединяющий ФИО для фильтрации
function filterArray(arr) {
    for (let i of arr) {
        const fio = `${i.surname} ${i.name} ${i.lastName}`;
        filterClient.push({
            fioClient: fio,
            contactsClient: i.contacts,
            idClient: i.id,
            updatedAtClient: i.updatedAt,
            createdAtClient: i.createdAt,
        });
    };
}

// Вызов поискового запроса с сервера
async function serverSerchClient(search) {

    let response = await fetch(SERVER_URL + `/api/clients?search=${search}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    })

    let data = await response.json();

    return data.map(normalizeClientContacts);
}

// Обновление списка DOM
function updateDOM() {
    filterClient.length = 0;
    filterArray(listСlient);
    renderClient(filterClient);
}

// Отправка поискового запроса на сервер при вводе в строку поиска с задержкой 300мс
$search.addEventListener ('keyup', () => {
    clearTimeout(timeout);
    timeout = setTimeout (async () => {
            searchValue = $search.value;
            serverDataSearch = await serverSerchClient(searchValue);
            if (serverDataSearch) {
                listСlient = serverDataSearch;
            }
            updateDOM()
    }, WAIT_TIME_MS);
});

filterArray(listСlient);

// Окно добавления/изменения клиента
function form(type, item, array, id) {
        // Элементы всплывающего окна
    const quantityForm = [],
        idContactForm = [],
        $addForm = document.createElement("form"),
        $myModal = document.createElement("div"),
        $box = document.createElement("div"),
        $buttonCloseBox = document.createElement("button"),
        $formContent = document.createElement("div"),
        $captionForm = document.createElement("h2"),

        // id для формы изменить всплывающего окна
        $idWrap = document.createElement("div"),
        $idCaption = document.createElement("span"),
        $idValue = document.createElement("span"),

        // ФИО всплывающего окна
        $formList = document.createElement("ul"),

        $liSurname = document.createElement("li"),
        $subjectSurname = document.createElement("h3"),
        $textSubjectSurname = document.createElement("span"),
        $surname = document.createElement("input"),
        $textSurname = document.createElement("span"),

        $liName = document.createElement("li"),
        $subjectName = document.createElement("h3"),
        $textSubjectName = document.createElement("span"),
        $name = document.createElement("input"),
        $textName = document.createElement("span"),

        $liLastname = document.createElement("li"),
        $subjectLastName = document.createElement("h3"),
        $lastName = document.createElement("input"),

        // Контакты всплывающего окна
        $formContact = document.createElement("div"),
        $contactList = document.createElement("ul"),
        $newContact = document.createElement("div"),
        $noticeError = document.createElement("div"),    
        $surnameError = document.createElement('p'),
        $nameError = document.createElement('p'),
        $lastNameError = document.createElement('p'),

        // Кнопки всплывающего окна
        $buttonBoxForm = document.createElement("div"),
        $backBox = document.createElement("div"),
        $deleteBox = document.createElement("div");

    // Иконки всплывающего окна
    let $imageClose = document.getElementById("image-close"),
        $imageLoadSave = document.getElementById("image-load-save");

    // Закрытие окна
    function closePopUp() {
        $myModal.classList.remove("open");
        // $addForm.remove();
        clearTimeout(timeout);
        timeout = setTimeout (async () => {            
            $buttonCloseBox.innerHTML = '';
            $addForm.remove();
        }, WAIT_TIME_MS);
    }    

    // Формирование окна при клике
    function clickPopUp() {    

        // Стили элементов формы
        $addForm.classList.add('form');
        $myModal.classList.add('modal', 'form__modal');
        $box.classList.add('box', 'modal__box');
        $buttonCloseBox.classList.add('close', 'box__close');
        $buttonCloseBox.tabIndex = '5';
        $formContent.classList.add('content', 'form__content');
        $captionForm.classList.add('caption', 'form__caption');

        // id для формы изменить
        $idWrap.classList.add('wrap', 'content__wrap');
        $idCaption.classList.add('text', 'content__text');
        $idValue.classList.add('text', 'content__text');

        // ФИО Стили элементов формы
        $formList.classList.add('list-reset', 'list', 'form__list');

        $liSurname.classList.add('item', 'form__item');
        $subjectSurname.classList.add('subject', 'form__subject');
        $textSubjectSurname.classList.add('text', 'subject__text');
        $surname.classList.add('input', 'form__input');
        $surname.placeholder = "Фамилия";
        $textSurname.classList.add('text', 'form__text', 'form__text-surname');

        $liName.classList.add('item', 'form__item');
        $subjectName.classList.add('subject', 'form__subject');
        $textSubjectName.classList.add('text', 'subject__text');
        $name.classList.add('input', 'form__input');
        $name.placeholder = "Имя";
        $textName.classList.add('text', 'form__text', 'form__text-name');

        $liLastname.classList.add('item', 'form__item');
        $subjectLastName.classList.add('subject', 'form__subject');
        $lastName.classList.add('input', 'form__input');
        $lastName.placeholder = "Отчество";

        // Контакты Стили элементов формы
        $formContact.classList.add('contact', 'form__contact');
        $contactList.classList.add('list-reset', 'list', 'contact__list');
        $newContact.classList.add('button', 'contact__button');
        $noticeError.classList.add('error', 'form__error');
        $buttonBoxForm.classList.add('box', 'form__box');
        $saveButton.classList.add('button', 'form__button');
        $saveButtonLoad.classList.add('button', 'form__button', 'form__button-load');
        $backBox.classList.add('back', 'form__back');
        $deleteBox.classList.add('back', 'form__back');

        // Иконки Стили элементов формы
        $imageLoadSave.classList.add('spinner', 'box__spinner');

        // Добавление иконок
        let $closeIcon = $imageClose.cloneNode(true);
        $closeIcon.classList.add('img-display');
        let $loadSaveIcon = $imageLoadSave.cloneNode(true);
        $loadSaveIcon.classList.add('img-display');

        // Наполнение элементов
        $idCaption.textContent = 'ID:';
        $subjectSurname.textContent = 'Фамилия';
        $textSubjectSurname.textContent = '*';
        $subjectName.textContent = 'Имя';
        $textSubjectName.textContent = '*';
        $subjectLastName.textContent = 'Отчество';

        $textSurname.textContent = '*';
        $textName.textContent = '*';

        $newContact.textContent = 'Добавить контакт';
        $newContact.tabIndex = '0';

        $saveButton.textContent = 'Сохранить';
        $saveButtonLoad.textContent = 'Сохранить';
        $backBox.textContent = 'Отмена';
        $backBox.tabIndex = '0';
        $deleteBox.textContent = 'Удалить клиента';
        $deleteBox.tabIndex = '0';
        
        // Вывод элементов
        $saveButtonLoad.append($loadSaveIcon);
        $buttonBoxForm.append($saveButton, $saveButtonLoad, $backBox, $deleteBox);
        $formContact.append($contactList, $newContact);
        $liLastname.append($subjectLastName, $lastName);
        $subjectName.append($textSubjectName);
        $liName.append($subjectName, $name, $textName);
        $subjectSurname.append($textSubjectSurname);
        $liSurname.append($subjectSurname, $surname, $textSurname);
        $formList.append($liSurname, $liName, $liLastname);
        $idWrap.append($idCaption, $idValue);
        $formContent.append($captionForm, $idWrap);
        $buttonCloseBox.append($closeIcon);
        $box.append($buttonCloseBox, $formContent, $formList, $formContact, $noticeError, $buttonBoxForm);
        $myModal.append($box);
        $addForm.append($myModal);
        $main.append($addForm);
        
        clearTimeout(timeout);
        timeout = setTimeout (async () => {
            $myModal.classList.add("open");
        }, 10);

        // Начальное состояное открывшегося окна
        $contactList.innerHTML = '';
        // $myModal.classList.add("open");
        $newContact.classList.remove('on-form', 'contact__button-none');
        $contactList.classList.remove('contact__list-onform');
        quantityForm.length = 0;
        idContactForm.length = 0;
        $surname.value = '';
        $name.value = '';
        $lastName.value = '';
        $noticeError.textContent = '';
        $noticeError.classList.remove('form__error-on');
        $formContact.classList.remove('form__contact-margin');

        // Закрытие окна клик на крестик
        $buttonCloseBox.addEventListener('click', function(){
            closePopUp();
        })
            
            // Закрытие окна при клике на "Отмена"
        $backBox.addEventListener('click', function(){
            document.querySelectorAll('.form__item').value = '';        
            closePopUp();
        })
            
        $backBox.addEventListener( 'keyup', event => {
            if( event.code === 'Enter' ) {
                closePopUp();
            } 
        });
            
            // Закрытие окна при нажатии Esc 
        window.addEventListener('keydown', (e) => {
            if (e.key === "Escape") {
                closePopUp();
            }
        })
            
            // Закрытие окна при клике вне окна
            $box.addEventListener('click', event => {
            event._isClickWithInModal = true;
        })
        $myModal.addEventListener('click', event => {
            if (event._isClickWithInModal) return;
            event.currentTarget.classList.remove("open");
            closePopUp();
        })
    }

    // Звёздочка input
    $surname.oninput = function() {

        if ($surname.value === '') {
            $textSurname.textContent = '*';
            return
        }
        $textSurname.textContent = '';
        };
    
        $name.oninput = function() {     
        if ($name.value === '') {
            $textName.textContent = '*';
            return
        } 
        $textName.textContent = '';
    };
    
        // Первая буква - заглавная
    function ucFirst(str) {
        if (!str) return str;
        return str[0].toUpperCase() + str.slice(1);
    }

        // Добавление формы контактов для нового клиента
    function contactForm(contactType, contactValue, contactIdType, contactIdValue) {
        // Создание элементов
            // Форма
        const $li = document.createElement("li"),
            $select = document.createElement("div"),
            $contactHead = document.createElement("div"),
            $contactCurrent = document.createElement("span"),
            $contactIconDown = document.createElement("div"),
            $contactIconUp = document.createElement("div"),
            $contactBody = document.createElement("div"),
            $contactPhone = document.createElement("div"),
            $contactMail = document.createElement("div"),
            $contactVk = document.createElement("div"),
            $contactOther = document.createElement("div"),
            $contactInput = document.createElement("input"),
            $contactDelete = document.createElement("div");

        // Стрелочки
        let $imgUp = document.getElementById("img-up").cloneNode(true),
            $imgDown = document.getElementById("img-down").cloneNode(true),
            $imgDelete = document.getElementById("img-delete").cloneNode(true);
            
        // Стили элементов
            //Форма
        $li.classList.add('item', 'contact__item', 'contact__item-flex');
        $select.classList.add('select', 'contact__select');
        $contactHead.classList.add('head', 'select__head', 'contact__item-flex');
        $contactHead.tabIndex = "0";

        $contactCurrent.classList.add('current', 'select__current');
        $contactCurrent.id = contactIdType;

        $contactIconDown.classList.add('icon', 'select__icon', 'select__icon-down');
        $contactIconUp.classList.add('icon', 'select__icon', 'select__icon-up');
        $contactBody.classList.add('body', 'select__body');
        $contactPhone.classList.add('item', 'select__item');
        $contactPhone.tabIndex = "0";
        $contactMail.classList.add('item', 'select__item');
        $contactMail.tabIndex = "0";
        $contactVk.classList.add('item', 'select__item');
        $contactVk.tabIndex = "0";
        $contactOther.classList.add('item', 'select__item');
        $contactOther.tabIndex = "0";

        $contactInput.id = contactIdValue;
        $contactInput.classList.add('input', 'contact__input');
        if(window.innerWidth < 768) {
            $contactInput.placeholder = 'Введите данные';
        } else {
        $contactInput.placeholder = 'Введите данные контакта';
        }
        
        $contactInput.type = 'text';
        $contactInput.name = 'value';

        $contactDelete.classList.add('delete', 'contact__delete');
        $contactDelete.tabIndex = "0";

            // Контакты иконки
        $imgUp.classList.add('img', 'select__img', 'img-display');
        $imgDown.classList.add('img', 'select__img', 'img-display');
        $imgDelete.classList.add('img', 'delete__img', 'img-display');

        // Наполнение элементов
            // Таблица
        $contactInput.value = contactValue;
        $contactCurrent.textContent = contactType;
        $contactPhone.textContent = "Телефон";
        $contactMail.textContent = "Email";
        $contactVk.textContent = "VK";
        $contactOther.textContent = "Другое";
            // Вывод
        $contactBody.append($contactPhone, $contactMail, $contactVk, $contactOther);
        $contactIconUp.append($imgUp);
        $contactIconDown.append($imgDown);
        $contactDelete.append($imgDelete);
        $contactHead.append($contactCurrent, $contactIconDown, $contactIconUp);
        $select.append($contactHead, $contactBody);
        $li.append($select, $contactInput, $contactDelete);

        function actionContactHead() {
            $contactBody.classList.toggle('is-active');
            $contactIconUp.classList.toggle('turn-on');
            $contactIconDown.classList.toggle('turn-off');
        }

        $contactHead.addEventListener('click', function() {
            actionContactHead();
        })

        $contactHead.addEventListener( 'keyup', event => {
            if( event.code === 'Enter' ) {
                actionContactHead();
            } 
        });

        if ($contactList !== '') {
            $contactList.classList.add('contact__list-onform');
            $newContact.classList.add('on-form');
        }

        function actionItem(item) {        
                let text = item.innerText,
                    select = item.closest('.contact__select'),
                    currentText = select.querySelector('.select__current');
                currentText.innerText = text;
                $contactBody.classList.remove('is-active');
                $contactIconUp.classList.remove('turn-on');
                $contactIconDown.classList.remove('turn-off');         
        } 
        
        function renderItem(item) {
            item.addEventListener('click', function() {
                actionItem(item);   
            })
            item.addEventListener( 'keyup', event => {
                if( event.code === 'Enter' ) {
                    actionItem(item);
                } 
            });
        }

        renderItem ($contactPhone);
        renderItem ($contactMail);
        renderItem ($contactVk);
        renderItem ($contactOther);

        // Удаление контакта, взятого с сервера
        if (contactValue === "") {
            $contactDelete.classList.remove('contact__delete--on');
            $contactInput.classList.remove('contact__input--delete');
        } else {
            $contactDelete.classList.add('contact__delete--on');
            $contactInput.classList.add('contact__input--delete');
        }

        $contactInput.oninput = function() {

            if ($contactInput.value === '') {
                $contactDelete.classList.remove('contact__delete--on');
                $contactInput.classList.remove('contact__input--delete');
                return
            }
            $contactDelete.classList.add('contact__delete--on');
            $contactInput.classList.add('contact__input--delete');
        };

        function deleteContactServer() {
            for (let i = 0; i < quantityForm.length; i++) {
                if ( quantityForm[i].idType === contactIdType ) {
                    quantityForm.splice (i, 1);
                    console.log(quantityForm);
                }
            }
            $li.remove($select, $contactInput, $contactDelete);
            $newContact.classList.remove('contact__button-none');

            if (quantityForm.length === 0) {
                $newContact.classList.remove('on-form', 'contact__button-none');
                $contactList.classList.remove('contact__list-onform');
            }
        }

        $contactDelete.addEventListener('click', function() {
            deleteContactServer()        
        });

        $contactDelete.addEventListener( 'keyup', event => {
            if( event.code === 'Enter' ) {
                deleteContactServer()  
            } 
        });

        return $li;
    }
    
    // Рендер формы контактов
    function  actionRender(contactType, contactValue, contactIdType, contactIdValue) {

        let $newSelect = null;
        $newSelect = contactForm(contactType, contactValue, contactIdType, contactIdValue);
        $contactList.append($newSelect);

        // Убрать кнопку после 10 форм
        if (quantityForm.length >= 10) {
            $newContact.classList.add('contact__button-none');
        }
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }
  
    // Рендер формы контактов по клику
    function renderContact() {      

        function enterСontact() {

            quantityForm.push({
                idType: `idContactNewType-${quantityForm.length + getRandomInt(100) + 1}`,
                idValue: `idContactNewValue-${quantityForm.length + getRandomInt(100) + 1}`
            });

            let renderIdType = quantityForm[quantityForm.length - 1].idType,
                renderIdValue = quantityForm[quantityForm.length - 1].idValue;
            actionRender('Телефон', '', renderIdType, renderIdValue);
        }

        $newContact.addEventListener('click', function() {
            enterСontact();
        })    

        $newContact.addEventListener( 'keyup', event => {
            if( event.code === 'Enter' ) {
                enterСontact();
            } 
        });
    }
    
    renderContact();

    // Валидация форм
    function validation(arr) {
        if($surname.value.trim() === "") {
            $noticeError.textContent = 'Ошибка: ведите фамилию';
            $noticeError.classList.add('form__error-on');
            $formContact.classList.add('form__contact-margin');
            return;
        }else {
            $noticeError.textContent = '';
            $noticeError.classList.remove('form__error-on');
            $formContact.classList.remove('form__contact-margin');
        }
    
        if($name.value.trim() === "") {     
            $noticeError.textContent = 'Ошибка: ведите имя';
            $noticeError.classList.add('form__error-on');
            $formContact.classList.add('form__contact-margin');
            return;
        }else {
            $noticeError.textContent = '';
            $noticeError.classList.remove('form__error-on');
            $formContact.classList.remove('form__contact-margin');
        }
    
        // Валидация контакты и добавление в массив
        for (const i in quantityForm) {
            let idContactType = document.getElementById(quantityForm[i].idType);
            let idContactValue = document.getElementById(quantityForm[i].idValue);
            if(idContactValue.value === '') {
                $noticeError.textContent = 'Ошибка: ведите данные контакта';
                $noticeError.classList.add('form__error-on');
                $formContact.classList.add('form__contact-margin');
                return;
            }else {
                $noticeError.textContent = '';
                $noticeError.classList.remove('form__error-on');
                $formContact.classList.remove('form__contact-margin');
                
                arr.push({
                    type: idContactType.innerText,
                    value: idContactValue.value.trim(),
                })
            }
        }
        
        return true;
    }

    // Отправка нового клиента
    function submitNewForm() {
        clickPopUp();
        $captionForm.textContent = 'Новый клиент';
        $idWrap.classList.add('turn-off');
        
        $subjectSurname.classList.add('turn-off');
        $subjectName.classList.add('turn-off');
        $subjectLastName.classList.add('turn-off');

        $backBox.classList.remove('turn-off');
        $deleteBox.classList.add('turn-off');
        
        $addForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            event.stopImmediatePropagation();

            const listContactsNew = [];

            if (validation(listContactsNew)) {
                
                let newClientObj = {
                    name: ucFirst($name.value.trim()),
                    surname: ucFirst($surname.value.trim()),
                    lastName: ucFirst($lastName.value.trim()),
                    contacts: listContactsNew,
                };
                    
                try {
                    await serverAddClient(newClientObj);
                    event.target.reset();
                    closePopUp();       
                    await loadClient();
                    updateDOM();

                } catch (error) {
                    $noticeError.textContent = `Ошибка: ${error.message}`;
                    $noticeError.classList.add('form__error-on');
                    $formContact.classList.add('form__contact-margin');
                    
                } finally {
                    // выкл loader
                    $saveButton.classList.remove('form__button-off');
                    $saveButtonLoad.classList.remove('form__button-on');
                }
            }
        })
    }

    // Отправка изменённого клиента
    function submitСhangeForm(item, array) {
        
        clickPopUp();
        // Скорректировать наполнение окна
        $captionForm.textContent = 'Изменить данные';
        $idWrap.classList.remove('turn-off');
        $idValue.textContent = array.idClient;
        
        $subjectSurname.classList.remove('turn-off');
        $subjectName.classList.remove('turn-off');
        $subjectLastName.classList.remove('turn-off');

        $backBox.classList.add('turn-off');
        $deleteBox.classList.remove('turn-off');

        // Наполнение формы из массива
            // ФИО
        $surname.value = item.surname;
        $textSurname.textContent = '';
        $name.value = item.name;
        $textName.textContent = '';
        $lastName.value = item.lastName;
            // Контакты
        let contactPopUp = item.contacts;
        for (const i in contactPopUp) {
            quantityForm.push({
                Type: contactPopUp[i].type,
                Value: contactPopUp[i].value,
                idType: `idContactType-${Number(i) + 1}`,
                idValue: `idContactValue-${Number(i) + 1}`,
            });
        }
        // Рендер контактов
        if (quantityForm.length > 0) {
            for (const i of quantityForm) {
                const renderType = i.Type,
                    renderValue = i.Value,
                    renderIdType = i.idType,
                    renderIdValue = i.idValue;
                actionRender(renderType, renderValue, renderIdType, renderIdValue);
            }
        }
        
        $addForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            event.stopImmediatePropagation();

            const listContactsСhange = [];
  
            if (validation(listContactsСhange)) {

                let СhangeClientObj = {
                    id: array.idClient,
                    name: ucFirst($name.value.trim()),
                    surname: ucFirst($surname.value.trim()),
                    lastName: ucFirst($lastName.value.trim()),
                    contacts: listContactsСhange,
                };
                
            try {
                await serverСhangeClient(СhangeClientObj.id, СhangeClientObj);
                event.target.reset();
                closePopUp();       
                await loadClient();
                updateDOM();
            } catch (error) {
                $noticeError.textContent = `Ошибка: ${error.message}`;
                $noticeError.classList.add('form__error-on');
                $formContact.classList.add('form__contact-margin');
                
            } finally {
                // выкл loader
                $saveButton.classList.remove('form__button-off');
                $saveButtonLoad.classList.remove('form__button-on');
            } 
                return
            }
        })
    }

    if (type === "add") {
        submitNewForm();
    } else if (type === "change") {
        submitСhangeForm(item, array);
    }

    // Удалить клиента при изменении
    function changeDelete() {
        closePopUp();
        deletePopUp(id);
    }

    $deleteBox.addEventListener('click', function() {
        changeDelete();
    })
    $deleteBox.addEventListener( 'keyup', event => {
        if( event.code === 'Enter' ) {
            changeDelete();
        }
    })

}

// Вызов окна добавления клиента
document.getElementById("new-client").addEventListener('click', function(){
    form("add");
})

// Окно подтверждения удаления клиента
async function deletePopUp(id) {

    // Создание элементов
    const $delModal = document.createElement("div"),
        $delBox = document.createElement("div"),
        $delClose = document.createElement("button"),
        $delСaption = document.createElement("h2"),
        $delDescr = document.createElement("p"),
        $delWrap = document.createElement("div"),
        $delDelete = document.createElement("button"),
        $delCancel = document.createElement("div");
    let $delImgClose = document.getElementById("image-close");

    // Стили элементов
    $delModal.classList.add('modal', 'main__modal');
    $delBox.classList.add('box', 'main__box');
    $delClose.classList.add('close', 'main__close');
    $delСaption.classList.add('caption', 'box__caption');
    $delDescr.classList.add('descr', 'box__descr');
    $delWrap.classList.add('wrap', 'box__wrapp');
    $delDelete.classList.add('button', 'box__button', 'box__button-delete');
    $delCancel.classList.add('button', 'box__button', 'box__button-cancel');    
    $delCancel.tabIndex = "0";
    $delImgClose.classList.add('button', 'box__button');
    
    // Наполнение элементов
    let $imageClose = $delImgClose.cloneNode(true);
    $imageClose.classList.add('img-display');
    $delСaption.textContent = "Удалить клиента";
    $delDescr.textContent = "Вы действительно хотите удалить данного клиента?";
    $delDelete.textContent = "Удалить";
    $delCancel.textContent = "Отмена";

    // Вывод элементов
    $delWrap.append($delDelete, $delCancel);
    $delClose.append($imageClose);
    $delBox.append($delClose, $delСaption, $delDescr, $delWrap);
    $delModal.append($delBox);
    $main.append($delModal);

    // Закрытие окна
    function closeDelPopUp() {
        $delModal.classList.remove("open");
        clearTimeout(timeout);
        timeout = setTimeout (async () => {
            $delModal.remove();
            await loadClient();
            updateDOM();
        }, WAIT_TIME_MS);
    }

    // Закрытие крестик
    $delClose.addEventListener('click', function(){
        closeDelPopUp();
    })
    $delClose.addEventListener( 'keyup', event => {
        if( event.code === 'Enter' ) {
            closeDelPopUp();
        }
    })
     // Закрытие "Отмена"
    $delCancel.addEventListener('click', function(){
        closeDelPopUp();
    })
    $delCancel.addEventListener( 'keyup', event => {
        if( event.code === 'Enter' ) {
            closeDelPopUp();
        }
    })
    // Закрытие окна при нажатии Esc 
    window.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            closeDelPopUp();
        }
    })
    // Закрытие окна при клике вне окна
    $delBox.addEventListener('click', event => {
        event._isClickWithInModal = true;
    })
    $delModal.addEventListener('click', event => {
        if (event._isClickWithInModal) return;
        closeDelPopUp();
    })

    // Открытие окна
    clearTimeout(timeout);
        timeout = setTimeout (async () => {
            $delModal.classList.add("open");
        }, 10);
    
    // Удаление с сервера
    async function $serverDeleteClient(id) {
        await serverDeleteClient(id);
        closeDelPopUp();
    }

    $delDelete.addEventListener("click", function(event){
        event.preventDefault();
        event.stopImmediatePropagation();
        $serverDeleteClient(id);
    })
    $delDelete.addEventListener( 'keyup', event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        if( event.code === 'Enter' ) {
            $serverDeleteClient(id);
        }
    })
    return true;
}

// Формирование строки с данными о клиенте
function clientTr(arr) {
    // Создание элементов
        // Таблица
    const $tr = document.createElement("tr"),
        $tdId = document.createElement("td"),
        $tdFio = document.createElement("td"),
        $tdDateAdd = document.createElement("td"),
        $spanTimeAdd = document.createElement("span"),
        $tdDateChange = document.createElement("td"),
        $spanTimeChange = document.createElement("span"),
        $tdContacts = document.createElement("td"),
        $tdAction = document.createElement("td");
        // Контакты иконки
    let $imageVk = document.getElementById("image-vk"),
        $imagePhone = document.getElementById("image-phone"),
        $imageMail = document.getElementById("image-mail"),
        $imageClient = document.getElementById("image-client"),
        $imageSix = document.getElementById("image-six");
        // Кнопки    
    const $change = document.createElement("button"),
        $imgChange = document.getElementById("image-change"),
        $delete = document.createElement("button");
    let $changeIcon = $imgChange.cloneNode(true);
    // Стили элементов
        //Таблица
    $tr.classList.add('row', 'body__row');
    $tdId.classList.add('col', 'col-id', 'body__col', 'body__col-id');
    $tdFio.classList.add('col', 'col-fio', 'body__col', 'body__col-fio');
    $tdDateAdd.classList.add('col', 'col-data', 'body__col', 'body__col-data');
    $spanTimeAdd.classList.add('time', 'col__time');
    $tdDateChange.classList.add('col', 'col-edit', 'body__col', 'body__col-edit');
    $spanTimeChange.classList.add('time', 'col__time');
    $tdContacts.classList.add('col', 'col-contact', 'body__col', 'body__col-contacts');
    $tdAction.classList.add('col', 'col-action', 'body__col', 'body__col-action');
        // Контакты иконки
    $imageVk.classList.add('image', 'col__image');
    $imagePhone.classList.add('image', 'col__image');
    $imageMail.classList.add('image', 'col__image');
    $imageClient.classList.add('image', 'col__image');
    $imageSix.classList.add('six', 'col__six');
        // Кнопки
    $change.classList.add('btn', 'col__btn', 'col__btn-change');
    $changeIcon.classList.add('load', 'col__load');
    $delete.classList.add('btn', 'col__btn', 'col__btn-delete');

    // Форматирование даты
        // Число.месяц.год
    function formatDate(date) {
        const yyyy = date.getFullYear();
        let mm = date.getMonth() + 1;
        let dd = date.getDate();
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        return dd + '.' + mm + '.' + yyyy;
    }
        // Часы минуты
    function formatDateTime(date) {
        let mm = date.getHours();
        let dd = date.getMinutes();
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        return mm + ':' + dd;
    }

    // Наполнение элементов
        // Таблица
    $tdId.textContent = arr.idClient;
    $tdFio.textContent = arr.fioClient;
    $tdDateAdd.textContent = formatDate(new Date(arr.createdAtClient)); 
    $spanTimeAdd.textContent = formatDateTime(new Date(arr.createdAtClient)); 
    $tdDateChange.textContent = formatDate(new Date(arr.updatedAtClient)); 
    $spanTimeChange.textContent = formatDateTime(new Date(arr.updatedAtClient));

        // Кнопки
    $change.textContent = "Изменить";
    $delete.textContent = "Удалить";

        // Вывод
    $change.append($changeIcon);
    $tdAction.append($change, $delete);
    $tdDateAdd.append($spanTimeAdd);
    $tdDateChange.append($spanTimeChange);
    $tr.append($tdId, $tdFio, $tdDateAdd, $tdDateChange, $tdContacts, $tdAction);

    // Добавление контактов в отдельный массив
    let listContacts = [];
    listContacts.push(arr.contactsClient);

    // Добавление контактов в общюю таблицу
    function $getNewContactsLi(arrContLi) {
        // Элементы контактов
        const $item = document.createElement("li"),
            $content = document.createElement("div"),
            $type = document.createElement("span"),
            $value = document.createElement("span");
        // Стили
        $item.classList.add('item', 'col__item');
        $item.tabIndex = "0";
        $content.classList.add('content', 'item__content');
        $type.classList.add('type', 'item__type');
        $value.classList.add('value', 'item__value');    
        // Наполнение
        $type.textContent = `${arrContLi.type}:`;
        $value.textContent = arrContLi.value;
        // Подбор иконки    
        let $contactIcon = null;
        if ($type.textContent === "Телефон:") {
            $contactIcon = $imagePhone.cloneNode(true);
        } else if ($type.textContent === "VK:") {
            $contactIcon = $imageVk.cloneNode(true);
        } else if ($type.textContent === "Email:") {
            $contactIcon = $imageMail.cloneNode(true);
        } else {
            $contactIcon = $imageClient.cloneNode(true);
        }
        $contactIcon.classList.add('img-display');

        $item.addEventListener( 'keyup', event => {
            if( event.code === 'Enter' ) {
                $content.classList.toggle("item__content-on");
            } 
          });

        // Вывод
        $content.append($type, $value);
        $item.append($content, $contactIcon);
        
        return $item;
    }

    // Рендер всех контактов
    function render(arrContact) {
        let copyArr = [...arrContact];

        const $list = document.createElement("ul");
        $list.classList.add('list-reset', 'list', 'col__list');

        $tdContacts.innerHTML = '';

        for (const contactObj of copyArr) {
            for (let i = 0; i < contactObj.length; ++i){
                let contactLi = contactObj[i];
                // Создаём элементы
                const $newLi = $getNewContactsLi(contactLi);
                // Выводим
                $list.append($newLi);
            }
            $tdContacts.append($list);
        }
    }

    // Рендер контактов, если их более 6
    function renderSix(arrContact) {
        let copyArr = [...arrContact];

        const $list = document.createElement("ul");
        $list.classList.add('list-reset', 'list', 'col__list');

        $tdContacts.innerHTML = '';

        for (const contactObj of copyArr) {
            for (let i = 0; i < contactObj.length; ++i) {
                let contactLi = contactObj[i];
                if (contactObj.indexOf(contactObj[i]) > 3) {
                    
                    const $item = document.createElement("li");       
                    $item.classList.add('item', 'col__item');
                    
                    const $newLi = $imageSix.cloneNode(true);
                    $newLi.classList.add('img-display');
                    $newLi.tabIndex = "0";

                    $item.append($newLi);
                    $list.append($item);

                    $newLi.addEventListener('click', function() {
                        render(arrContact);
                    })

                    $newLi.addEventListener( 'keyup', event => {
                        if( event.code === 'Enter' ) {
                            render(arrContact);
                        } 
                      });

                    break;
                } else {
                    // Создаём элементы
                    const $newLi = $getNewContactsLi(contactLi);
                // Выводим
                $list.append($newLi);
                }        
            }
            $tdContacts.append($list);
        }
    }

    // Условие рендера контактов
    function renderContacts(arrContact) {
        
        if (arrContact[0].length > 5) {
            renderSix(arrContact);        
        } else {
            render(arrContact);
        }
    }

    renderContacts(listContacts)

    // Изменить данные клиента
    $change.addEventListener("click", async function(){
        let client = await serverGetOneClient(arr.idClient);  
        form("change", client, arr, arr.idClient);
    })
    // Удалить клиента 
    $delete.addEventListener("click", async function(){        
        deletePopUp(arr.idClient);
    })

        
    return $tr;    
}

// Сортировка

// Рендер строки с клиентом
function renderClient(arr) {
    let copyArr = [...arr];

    copyArr = copyArr.sort(function(a, b) {
        let sort = a[sortColumnFlag] < b[sortColumnFlag];

        if (sortDirFlag === false) {
        sort = a[sortColumnFlag] > b[sortColumnFlag];
        } 

        if(sort) return -1;
    })

    const $tableBody = document.getElementById("table-body");
    $tableBody.innerHTML = '';

    for (const clientObj of copyArr) {
        const $newTr = clientTr(clientObj);
        $tableBody.append($newTr);
    }
       
}

renderClient(filterClient);

// Клики сортировки
const $thId = document.getElementById('th-id'),
    $thFio = document.getElementById('th-fio'),
    $thDataCreate = document.getElementById('th-dataCreate'),
    $thDataСhange = document.getElementById('th-dataСhange');

// Общая функция сортировки
function sortClick(name, drow, up) {
    sortColumnFlag = name;
    sortDirFlag = !sortDirFlag;
    if (sortDirFlag === true) {
        document.getElementById(drow).classList.add('img-none');
        document.getElementById(up).classList.remove('img-none');
    } else {
        document.getElementById(drow).classList.remove('img-none');
        document.getElementById(up).classList.add('img-none');
    }
    renderClient(filterClient);
}

$thId.addEventListener('click', function() {
    sortClick('idClient', 'img-id-drow', 'img-id-up');
})
$thId.addEventListener( 'keyup', event => {
    if( event.code === 'Enter' ) {
        sortClick('idClient', 'img-id-drow', 'img-id-up');
    }
})

$thFio.addEventListener('click', function() {
    sortClick('fioClient', 'img-fio-drow', 'img-fio-up');
})
$thFio.addEventListener( 'keyup', event => {
    if( event.code === 'Enter' ) {
        sortClick('fioClient', 'img-fio-drow', 'img-fio-up');
    }
})

$thDataCreate.addEventListener('click', function() {
    sortClick('createdAtClient', 'img-dataCreate-drow', 'img-dataCreate-up');
})
$thDataCreate.addEventListener( 'keyup', event => {
    if( event.code === 'Enter' ) {
        sortClick('createdAtClient', 'img-dataCreate-drow', 'img-dataCreate-up');
    }
})

$thDataСhange.addEventListener('click', function() {
    sortClick('updatedAtClient', 'img-dataChange-drow', 'img-dataChange-up');
})
$thDataСhange.addEventListener( 'keyup', event => {
    if( event.code === 'Enter' ) {
        sortClick('updatedAtClient', 'img-dataChange-drow', 'img-dataChange-up');
    }
})
    

