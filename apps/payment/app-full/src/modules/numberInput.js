import { BoxInput } from './boxInput.js'
import { el, setChildren } from 'redom';
import '../style.scss';

import paysistem from '../assets/image/paysistem.svg';
import dinersclub from '../assets/image/dinersclub.svg';
import americanexpress from '../assets/image/americanexpress.svg';
import mir from '../assets/image/mir.svg';
import maestro from '../assets/image/maestro.svg';
import visa from '../assets/image/visa.svg';
import mastercard from '../assets/image/mastercard.svg';

const imgArr = [
    {
        name: 'diners-club',
        link: dinersclub,
    },
    {
        name: 'american-express',
        link: americanexpress,
    },
    {
        name: 'mir',
        link: mir,
    },
    {
        name: 'maestro',
        link: maestro,
    },
    {
        name: 'visa',
        link: visa,
    },
    {
        name: 'mastercard',
        link: mastercard,
    },
];

//Валидация номер карты
export class NumberInput extends BoxInput {

    constructor(title, mask, arr, err = true) {
        super(title, mask, arr, err);
        this.img = el('img', {class: 'form__image'});
        this.box.append(this.img);

        this.input.addEventListener('focus', () => {
            this.img.classList.add('form__image-none');
            this.img.src = paysistem;
        })

    }


    set inputValue(value) {
        this._inputValue = value;

        const valid = require( "card-validator" );
        let numberValidation = valid.number(value);
        this.valid = numberValidation.isValid;
        try {
            if(!this.valid)  {
                renderInvalidCardNumber();
            }
        } catch(error) {
            this.arrErr.push({err: 'Неверный номер карты'})
        }

        if(numberValidation.card)  { 
            // console.log(numberValidation.card.type) ;  // 'виза'
            imgArr.map((obj) => {
                if(numberValidation.card.type === obj.name) {
                    this.img.src = obj.link;
                    return
                }
            })
        }

        this.img.onerror = function() {
            this.src = paysistem;
            throw new Error('Ошибка загрузки изображения');
        };

        this.img.classList.remove('form__image-none');
    }

    get inputValue() {
        return this._inputValue;
    }
}