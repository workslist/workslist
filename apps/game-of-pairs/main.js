import { AmazingCard } from './card.js';

document.addEventListener('DOMContentLoaded', () => {

    function newGame(container, cardsCount) {

        let cardNumberArray = [],
            cardsArray = [],
            firstCard = null,
            secondCard = null;

        for (let i = 1; i <= cardsCount / 2; i++) {
            cardNumberArray.push(i, i)
        }

        for (let i = 0; i < cardNumberArray.length; ++i) {
            const j = Math.floor(Math.random() * (cardNumberArray.length - 1));
            let temp = null;
            temp = cardNumberArray[i];
            cardNumberArray[i] = cardNumberArray[j];
            cardNumberArray[j] = temp;
        }

        for (const number of cardNumberArray) {
            cardsArray.push(new AmazingCard(container, number, flip));
        }

        function flip(cardNumber) {
            if (firstCard !== null && secondCard !== null) {
                if (firstCard.number !== secondCard.number) {
                    firstCard.open = false;
                    secondCard.open = false;
                    firstCard = null;
                    secondCard = null;
                }
            }

            if (firstCard === null) {
                firstCard = cardNumber;
            } else {
                if (secondCard === null) {
                    secondCard = cardNumber;
                }
            }

            if (firstCard !== null && secondCard !== null) {
                console.log(firstCard.number);
                if (firstCard.number === secondCard.number) {
                    firstCard.success = true;
                    secondCard.success = true;
                    firstCard = null;
                    secondCard = null;
                }
            }

                const WAIT_TIME_MS = 300;
                let timeout = null;

                if (document.querySelectorAll('.iiem.success').length === cardNumberArray.length) {
                        timeout = setTimeout(() => {
                        alert('Победа!');
                        const button = document.createElement ('button');
                        button.classList.add('btn');
                        button.textContent = 'Сыграть ещё раз';
                        document.getElementById('container').append(button);

                        button.addEventListener('click', () => {
                        container.innerHTML = '';
                        cardNumberArray = [];
                        cardsArray = [];
                        firstCard = null;
                        secondCard = null;
                        button.remove();
                        newGame(container, cardsCount);
                        })
                        }, WAIT_TIME_MS);
                }
        }
    }

    newGame(document.getElementById('list'), 8);
});
