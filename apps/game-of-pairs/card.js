class Card { // класс

    _open = false;
    _success = false;

    constructor(container, cardNumber, flip) {
        this.cardNumber = document.createElement ('li');
        this.cardNumber.classList.add('iiem');
        this.cardNumber.setAttribute('tabindex', '0');
        this.number = cardNumber;

        // Открываем карточку
        this.cardNumber.addEventListener('click', () => {
            if (this.open === false && this._success === false) {
                this.open = true;
                flip(this);
            } 
        })
    
        container.append(this.cardNumber);
    }

    set number(value) {
        this._number = value;
        this.cardNumber.textContent = value;
    }

    get number() {
        return this._number
    }

    set open(value) {
        this._open = value;
        value ? this.cardNumber.classList.add('open') : this.cardNumber.classList.remove('open');
    }

    get open() {
        return this._open;
    }

    set success(value) {
        this._success = value;
        value ? this.cardNumber.classList.add('success') : this.cardNumber.classList.remove('success');
    }

    get success() {
        return this._success;
    }
}

export class AmazingCard extends Card {
    set number(value) {
        this._number = value;

        // // Новая логика, добавить картинку и убрать отображение цифр.
        this.cardNumber.textContent = '';

        const cardsImgArray = [
            './img/icon_12.png',
            './img/icon_2.png',
            './img/icon_3.png',
            './img/icon_4.png',
            './img/icon_5.png',
            './img/icon_6.png',
            './img/icon_7.png',
            './img/icon_8.png',
            ]
            this.img = document.createElement('img')
            this.img.classList.add('image');
            this.img.src = cardsImgArray[value - 1]

            // Обработка ошибки
            this.img.onerror = function() {
                this.src = './img/none.png';
                throw new Error('Ошибка загрузки изображения');
            };
            
            this.cardNumber.append(this.img)
    }

    get number() {
        return this._number
    }

    set open(value) {
        super.open = value
        // Новая логика, отобразить картинку с помощью стилей
        value ? this.img.classList.add('img_open') : this.img.classList.remove('img_open');
    }

    get open() {
        return this._open;
    }
}


