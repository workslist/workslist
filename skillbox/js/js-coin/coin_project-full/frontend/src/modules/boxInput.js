import { el, setChildren } from 'redom';
import IMask from 'imask';
import '../css/style.scss';

// title - Заголовок поля ввода и ошибки
// mask - объект маски https://imask.js.org/guide.html#masked-number
// err - обязательное поле или нет (по умолчанию обязательное)

let errorArr = [];

export class BoxInput {
  constructor(title, mask, arr, err = true) {
    this.box = el('div', { class: 'form__box' });
    this.title = el('h2', { class: 'form__subject' }, title);
    this.input = el('input', { class: 'form__input', type: 'text' });
    this.span = el('span', { class: 'form__error' });

    this.arrErr = [];
    this.err = err;

    setChildren(this.box, [this.title, this.input, this.span]);

    if (err) {
      arr.push({
        name: title,
        err: err,
      });
    }

    if (mask !== 'none') {
      this.maskOptions = mask;
      this.mask = IMask(this.input, this.maskOptions);
    }

    this.input.addEventListener('focus', () => {
      this.arrErr.length = 0;
      this.err = err;
      this.span.textContent = '';
      this.input.classList.remove('form__input-valid');
      this.span.classList.remove('form__error-valid');
      document.getElementById('btn').disabled = true;
    });

    this.input.addEventListener('blur', () => {
      this.inputValue = this.input.value;
      if (!this._inputValue && err === true)
        this.arrErr.push({ err: `Заполните поле` });

      this.arrErr.map((obj) => {
        this.span.textContent = obj.err;
      });

      if (this.arrErr.length) {
        this.input.classList.add('form__input-valid');
        this.span.classList.add('form__error-valid');
      } else {
        this.err = false;
      }

      if (err) {
        for (const item of arr) {
          if (item.name === title) {
            item.err = this.err;
            break;
          }
        }
        for (const item of arr) {
          if (item.err) {
            btn.disabled = true;
            break;
          }
          btn.disabled = false;
        }
      }
    });
  }
}

// email для отправки онлайн-чека.
export class MailInput extends BoxInput {
  set inputValue(value) {
    this._inputValue = value;
    const validator = require('email-validator');
    let emailValid = validator.validate(value); // true

    if (!emailValid) {
      this.arrErr.push({ err: 'Некорректный email' });
    }
  }

  get inputValue() {
    return this._inputValue;
  }
}

// CVC/CVV (3 цифры на обороте карты);
export class CcvInput extends BoxInput {
  set inputValue(value) {
    this._inputValue = value;
    const valid = require('card-validator');
    const ccvValidation = valid.cvv(value);

    if (!ccvValidation.isValid) {
      this.arrErr.push({ err: 'Неверное значение' });
    }
  }

  get inputValue() {
    return this._inputValue;
  }
}

// Валидация дата окончания действия карты (ММ/ГГ)
export class DateInput extends BoxInput {
  set inputValue(value) {
    this._inputValue = value;
    const valid = require('card-validator');
    const dateValidation = valid.expirationDate(value);

    if (!dateValidation.isValid) {
      this.arrErr.push({ err: 'Срок действия карты истёк' });
    }
  }

  get inputValue() {
    return this._inputValue;
  }
}
