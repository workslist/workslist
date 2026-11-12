'use strict'

import { el, setChildren } from 'redom';
import IMask from 'imask';
import { doc } from 'prettier';

export class BoxInput {
  constructor(title, valInput, arrBtn, arrError, mask, btnId) {
    this.box = el('div');
    this.input = el('input', {
      class: 'form__inpu',
      type: 'text',
      name: 'login',
    });
    this.errInput = el('span', { class: 'form__error' });

    setChildren(this.box, [this.input, this.errInput]);

    this.valInput = valInput;

    this.newMask = IMask(this.input, mask);

    arrBtn.push({
      name: title,
      err: true,
    });

    

    this.input.addEventListener('focus', () => {
      this.objErr = {};
      arrError.length = 0;
      this.err = true;
      this.errInput.textContent = '';
      this.input.classList.remove('form__input-valid');
      this.errInput.classList.remove('form__error-valid');
      document.getElementById(btnId).disabled = true;
    });

    this.input.addEventListener('blur', () => {
      this.inputValue = this.input.value;
      if (this.objErr.err) {
        arrError.push(this.objErr);
      }
      arrError.map((obj) => {
        this.errInput.textContent = obj.err;
      });
      if (arrError.length) {
        this.input.classList.add('form__input-valid');
        this.errInput.classList.add('form__error-valid');
      } else {
        this.err = false;
      }
      for (const item of arrBtn) {
        if (item.name === title) {
          item.err = this.err;
          break;
        }
      }
      for (const item of arrBtn) {
        if (item.err) {
          document.getElementById(btnId).disabled = true;
          break;
        }
        document.getElementById(btnId).disabled = false;
      }
    });
  }
}

// export class NumCheckInput extends BoxInput {
//   set inputValue(value) {
//     this._inputValue = value;
//     const regex = /^\S{1,}$/;
//     if (!regex.test(value)) {
//       this.objErr = { err: 'Поле не может быть пустым' };
//     }
//   }

//   get inputValue() {
//     return this._inputValue;
//   }
// }

export class SumCheckInput extends BoxInput {
  set inputValue(value) {
    this._inputValue = value;
    const regex = /^\S{1,}$/;
    if (!regex.test(value)) {
      this.objErr = { err: 'Поле не может быть пустым' };
    }
  }

  get inputValue() {
    return this._inputValue;
  }
}

export class LoginInput extends BoxInput {
  constructor(title, valInput, arrBtn, arrError, mask, btnId, arrLogin) {
    super(title, valInput, arrBtn, arrError, mask, btnId);

    this.input.addEventListener('blur', () => {
      this.inputValue = this.input.value;
      if (valInput === 'login') {
        arrLogin[0].login = this.inputValue;
      } else {
        arrLogin[0].pas = this.inputValue;
      }
    });
  }
  set inputValue(value) {
    this._inputValue = value;
    const regex = /^\S{6,}$/;
    if (!regex.test(value)) {
      this.objErr = { err: 'Значение меньше 6 символов' };
    }
  }

  get inputValue() {
    return this._inputValue;
  }
}
