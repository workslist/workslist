import { createDEVFromText } from '../dom-helpers';
// import { el, setChildren } from 'redom';
import { NumberInput } from '../src/modules/numberInput.js'
import { DateInput, CcvInput, MailInput } from '../src/modules/boxInput.js'
import './style.scss';

import { numberMask, dateMask, ccvMask, mailMask } from '../src/modules/mask.js'


let arrError = [];

    let numberInput = new NumberInput('Номер карты', numberMask, arrError);
    let dateInput = new DateInput('ММ/ГГ', dateMask, arrError);
    let ccvInput = new CcvInput('CVV/CVC', ccvMask, arrError);
    let mailInput = new MailInput('Email', mailMask, arrError);


test('Функция createDEVFromText должна создать dev с 4-мя input с placeholder', () => {
    const expectedText = '<div><input class=" form__input" type="text" placeholder="Номер карты"><input class=" form__input" type="text" placeholder="ММ/ГГ"><input class=" form__input" type="text" placeholder="CVV/CVC"><input class=" form__input" type="text" placeholder="Email"></div>';
    const el = createDEVFromText([numberInput.input, dateInput.input, ccvInput.input, mailInput.input]);
    expect(el).toBeInstanceOf(HTMLDivElement); // Проверяет является ли переданное значение объектом клласса
    expect(el.outerHTML).toBe(expectedText);
})