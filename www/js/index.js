import reset from '../css/reset.css';
import style from '../css/style.css'

import 'core-js';
import { DOMHelper } from './dom';
import { Timetables } from './timetables';
import { Card } from './card';

import { Promise } from 'bluebird';
Promise.config({
    cancellation: true
});

const dom = Object.create(DOMHelper);
const timetables = Object.create(Timetables);
const card = Object.create(Card);
const pendingPromises = new Set();
let refreshHandle;

const onError = (e) => {
    const errorMessage = e.message || e.code || e;
    const information = `Nie udało się pobrać danych przystanków w okolicy. Upewnij się, że masz włączone usługi lokalizacji oraz dostęp do Internetu, a następnie uruchom ponownie aplikację. (${errorMessage})`;
    navigator.notification.alert(information, null, '¯\\_(ツ)_/¯');
    console.error(e);
};

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

const formatTime = (date) => {
    const twoDigits = (input) => input < 10 ? '0' + input : '' + input;
    return [date.getHours(), date.getMinutes(), date.getSeconds()]
        .map((segment) => segment < 10 ? '0' + segment : '' + segment)
        .join(':');
}

const refreshView = (onRefresh) => {
    const promise = timetables.fetchNearbyTimetables()
        .then((boardsData) => {
            pendingPromises.delete(promise);

            let cardsHandles = dom.$all('.card');
            if (cardsHandles.length === 0) {
                cardsHandles = renderBoards(boardsData);
            }
            else {
                updateBoards(boardsData, cardsHandles);
            }
            if (!refreshHandle) {
                refreshHandle = setupRefresh(cardsHandles);
            }
            dom.$('.menu span').innerText = `Ostatnia aktualizacja danych: ${formatTime(new Date())}.`;
            if (onRefresh) {
                onRefresh();
            }
        }).catch((error) => {
            pendingPromises.delete(promise);
            onError(error);
        });
    pendingPromises.add(promise);
}

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

const updateBoards = (boardsData, cardsHandles) => {
    boardsData.forEach((boardData, index) => card.update(cardsHandles[index], boardData));
}

const setupRefresh = (cardsHandles) => {
    const refreshInterval = 15 * 1000;

    return setInterval(refreshView, refreshInterval);
};

const onInfo = (e) => {
    const information =
        `Wygodny klient rozkładów jazdy dostępnych na stronie rozklady.lodz.pl. Aplikacja wyświetla na żywo tablice rozkładowe przystanków znajdujących się w okolicy.

Kontakt: tabliceprzystankowe@gmail.com`;
    navigator.notification.alert(information, null, 'Tablice Przystankowe');
}

const onPause = () => {
    clearInterval(refreshHandle);
    pendingPromises.forEach((p) => p.cancel());
    pendingPromises.clear();
};
const onResume = () => {
    refreshView();
};

const onDeviceReady = () => {
    if (cordova.platformId == 'android') {
        StatusBar.backgroundColorByHexString('ee8801');
    }

    const stopAnimateSplash = animateSplash();

    dom.$('#menu-info').addEventListener('click', onInfo);
    document.addEventListener('pause', onPause);
    document.addEventListener('resume', onResume);

    refreshView(stopAnimateSplash);
};

document.addEventListener('deviceready', onDeviceReady);
