


export const numberMask = '0000 0000 0000 0000 0000';
export const ccvMask = '000';
export const mailMask = 'none';

let dateY = new Date().getFullYear();
let newDateY = (dateY.toString().slice(-2)) * 10;
let dateM = new Date().getMonth();

export const dateMask = {
    mask: Date,
    pattern: 'm/`Y',
    blocks: {
      m: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 12,
        maxLength: 2,
      },
      Y: {
        mask: IMask.MaskedRange,
        from: newDateY,
        to: 999,
        maxLength: 2,
      },
    }
  }