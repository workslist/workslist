import { el } from 'redom';
import '../css/header.scss';

export class Header {
  constructor() {
    this.box = el('div', {class:'header'});
    this.linkLogo = el('a', { href: '/', class:'logo header__logo' }, 'Coin.');
    // this.logo = el('p', { src: logo, alt: 'Coin'}, );
    this.listMenu = el('ul', { class:'list header__list' });

    this.itemATM = el('li', { class:'item header__item' }, [
      el('a', { href: '/banks', class:'item header__item header__item-descr' }, 'Банкоматы')
    ]);
    this.itemCheck = el('li', { id: 'itemCheck', class:'item header__item' }, [
      el('a', { href: '/accounts', class:'item header__item header__item-descr' }, 'Счета')
    ]);
    this.itemСurrency = el('li', { class:'item header__item' }, [
      el('a', { href: '/currencies', class:'item header__item header__item-descr' }, 'Валюта')
    ]);
    this.itemExit = el('li', { class:'item header__item' }, [
      el('a', { href: '/login', class:'item header__item header__item-descr' }, 'Выйти')
    ]);

    const path = window.location.pathname;
    
    if (path === '/banks') {
      this.itemATM.classList.add('header__item-hover')
    }

    if (path === '/accounts') {
      this.itemCheck.classList.add('header__item-hover')
    }

    if (path === '/currencies') {
      this.itemСurrency.classList.add('header__item-hover')
    }

    this.listMenu.append(this.itemATM, this.itemCheck, this.itemСurrency, this.itemExit)
    this.box.append(this.linkLogo, this.listMenu);

    this.itemExit.addEventListener('click', async function () {
      localStorage.removeItem('tokenUser');
    });

  }
}