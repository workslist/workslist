import { el } from 'redom';
// import logo from './assets/images/logo.svg';
import './header.scss';

export default el('header', [
    el('div', {class: 'page-header-text'}, 'Форма для онлайн-оплаты'),
    // el('img', { class: 'page-header-logo', src: logo }),
]);
