import { el } from 'redom';

export const headerLogin = el('header', [
  el('div', {class:'header'}, [
    el('a', { href: '/', class:'logo header__logo' }, 'Coin.')
  ])
]);
