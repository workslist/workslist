import { NumberInput } from './src/modules/numberInput.js'
import { CcvInput } from './src/modules/boxInput.js'
import { numberMask, ccvMask } from './src/modules/mask.js'

let arrError = [];

//Инпут номер карты
export function isValidNumberInput(str) {
  let numberInput = new NumberInput('Номер карты', numberMask, arrError);
  numberInput.inputValue = str;
  return numberInput.valid;
}

//Инпут ccv
export function isValidCCVInput(str) {
  let ccvInput = new CcvInput('CVC/CVV (3 цифры на обороте карты)', ccvMask, arrError);
  ccvInput.inputValue = str;
  return ccvInput.valid;
}