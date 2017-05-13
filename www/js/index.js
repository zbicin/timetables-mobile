import reset from '../css/reset.css';
import style from '../css/style.css'

import 'core-js';
import { DOMHelper } from './dom';
import { Timetables } from './timetables';
import { Card } from './card';

const dom = Object.create(DOMHelper);
const timetables = Object.create(Timetables);
const card = Object.create(Card);
let refreshHandle;

/* ui */
const animateSplash = () => {
    let direction = 'up';
    const splash = dom.$('.splash');

    const changeDirection = () => {
        if (direction === 'out') {
            splash.removeEventListener('transitionend', changeDirection);
        } else {
            direction = direction === 'down' ? 'up' : 'down';
        }
        ['down', 'up'].forEach((c) => splash.classList.remove(c));
        splash.classList.add(direction);
    }

    splash.addEventListener('transitionend', changeDirection);
    changeDirection();

    return (outCallback) => {
        direction = 'out';
        splash.addEventListener('transitionend', outCallback);
    };
};

const renderBoards = (boards) => {
    const container = document.querySelector('.cards');
    const fragment = document.createDocumentFragment();
    const cards = boards.map(card.buildFullCard);

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    cards.forEach((card) => fragment.appendChild(card));
    container.appendChild(fragment);

    return cards;
};

const setupRefresh = (cardsHandles) => {
    const refreshInterval = 30 * 1000;

    return setInterval(() => {
        timetables.fetchNearbyTimetables()
            .then((boardsData) => {
                boardsData.forEach((boardData, index) => card.update(cardsHandles[index], boardData));
            });
    }, refreshInterval);
};

/* handlers */
const onError = (e) => {
    const errorMessage = e.message || e.code || e;
    const information = `Nie udało się pobrać danych przystanków w okolicy. Upewnij się, że masz włączone usługi lokalizacji oraz dostęp do Internetu, a następnie uruchom ponownie aplikację. (${errorMessage})`;
    navigator.notification.alert(information, null, '¯\\_(ツ)_/¯');
    console.error(e);
};


const onInfo = (e) => {
    const information =
        `Wygodny klient rozkładów jazdy dostępnych na stronie rozklady.lodz.pl. Aplikacja wyświetla na żywo tablice rozkładowe przystanków znajdujących się w okolicy.

Kontakt: tabliceprzystankowe@gmail.com`;
    navigator.notification.alert(information, null, 'Tablice Przystankowe');
}

const onPause = () => clearInterval(refreshHandle);
const onResume = () => {
    if(!refreshHandle) {
        const cardsHandles = dom.$all('.card');
        refreshHandle = setupRefresh(cardsHandles);
    }
};

const onDeviceReady = () => {
    if (cordova.platformId == 'android') {
        StatusBar.backgroundColorByHexString('ee8801');
    }

    const stopAnimateSplash = animateSplash();

    dom.$('#menu-info').addEventListener('click', onInfo);
    document.addEventListener('pause', onPause);
    document.addEventListener('resume', onResume);

    timetables.fetchNearbyTimetables()
        .then((boardsData) => {
            const cardsHandles = renderBoards(boardsData);
            refreshHandle = setupRefresh(cardsHandles);
            stopAnimateSplash();
        }).catch(onError);
};

document.addEventListener('deviceready', onDeviceReady);
