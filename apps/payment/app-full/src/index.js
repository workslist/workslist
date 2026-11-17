import { el, setChildren } from 'redom';
import { NumberInput } from './modules/numberInput.js';
import { DateInput, CcvInput, MailInput } from './modules/boxInput.js';
import header from './header.js';
import './style.scss';

import { numberMask, dateMask, ccvMask, mailMask } from './modules/mask.js';

let arrError = [];

function catalogList() {

    let numberInput = new NumberInput('Номер карты', numberMask, arrError);
    let dateInput = new DateInput('ММ/ГГ', dateMask, arrError);
    let ccvInput = new CcvInput('CVV/CVC', ccvMask, arrError);
    let mailInput = new MailInput('Email', mailMask, arrError);
    const button = el('button', {id: 'btn', class: 'form__button', disabled: true }, 'Оплатить');

    const form = el('form', {class: 'form'}, [
        numberInput.box,
        dateInput.box,
        ccvInput.box,
        mailInput.box,
        button,
    ])

    return el('div', [
        form
    ])
}

const main = el('main');

setChildren(window.document.body, [
    header,
    main,
])
    
setChildren(main, catalogList());