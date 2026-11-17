// Меню

const $buttonBurger = document.querySelector('.burger');
const $menu = document.querySelector('.menu');
const $close = document.querySelector('.close');

const tlMenu = gsap.timeline({});

tlMenu.from('.menu__top', {duration: .6, y: -150, ease: "slow"});
tlMenu.from('.menu__top', {duration: .6, opacity: 0.2, ease: "slow"});

tlMenu.fromTo('.close', {opacity: 0}, {duration: .6, opacity: 1, ease: "expo.out"}, "-=100%");

tlMenu.from('.menu', {duration: 1.2, opacity: 0, ease: "none"});

tlMenu.from('.menu__nav', {duration: .6, y: 100, opacity: 0, ease: "expo.out"}, "-=50%");
tlMenu.from('.social', {duration: .6, y: 100, opacity: 0, ease: "expo.out"}, "-=50%");
tlMenu.from('.menu__right', {duration: .6, y: 100, opacity: 0, ease: "expo.out"}, "-=100%");

$buttonBurger.addEventListener('click', () => {
  $menu.classList.add('menu--open');
  tlMenu.play();
})

$close.addEventListener('click', () => {
  tlMenu.reverse();
  setTimeout(() => {
    $menu.classList.remove('menu--open');
  }, 1000);
})

// Стартовая анимация

const tlStart = gsap.timeline({});

tlStart.from('.hero__title', {duration: 1.4, y: 200,  opacity: 0, ease: "expo.out"});
tlStart.from('.hero__btn', {duration: 1.4, y: 200,  opacity: 0, ease: "expo.out"}, "-=100%");
tlStart.from('.hero__descr', {duration: 1.4, opacity: 0, ease: "expo.out"}, "-=1");
tlStart.from('.photos__img', {duration: 1.4, opacity: 0, scale: .8, stagger: 0.25, ease: "expo.out"}, "-=1.2");
tlStart.from('.photos__author', {duration: 1.9, opacity: 0, ease: "expo.out"}, "-=1.2");
