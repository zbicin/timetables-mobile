import reset from '../css/reset.css';
import style from '../css/style.css'

import 'core-js';
import { DOMHelper } from './dom';
// import { DummyTimetables as Timetables } from './timetables.dummy';
import { Timetables } from './timetables';
import { Card } from './card';

import { Promise } from 'bluebird';
Promise.config({
    cancellation: true
});

const card = Object.create(Card);
const dom = Object.create(DOMHelper);
const pendingPromises = new Set();
const refreshIntervalInSeconds = 30;
const timetables = Object.create(Timetables);

let pullStartY = null;
let pullDiffY = 0;

let cardsContainer;
let cardsHandles;
let pullDiffLimit;
let pullIndicator;
let lastRefreshTime;
let loaderElement;
let splashElement;
let refreshHandle;

const cleanupHandles = () => {
    clearInterval(refreshHandle);
    pendingPromises.forEach((p) => p.cancel());
    pendingPromises.clear();
};

const onError = (e) => {
    const errorMessage = e.message || e.code || e;

    let information;

    if(e instanceof XMLHttpRequest) {
        information = 'Wystąpił problem z połączeniem internetowym. Sprawdź ustawienia telefonu i spróbuj ponownie.';
    } else if (e.toString().indexOf('PositionError') > -1) {
        information = 'Nie udało się ustalić Twojego położenia. Sprawdź ustawienia lokalizacji w swoim urządzeniu i spróbuj ponownie.';
    } else {
        information = `Nie udało się pobrać danych przystanków w okolicy. Upewnij się, że masz włączone usługi lokalizacji oraz dostęp do Internetu, a następnie uruchom ponownie aplikację. (${errorMessage})`;
    }
    navigator.notification. alert(information, null, '¯\\_(ツ)_/¯');
    console.error(e);

    cleanupHandles();

    if (loaderElement) {
        loaderElement.classList.remove('active');
    }
    if(splashElement) {
        splashElement.classList.remove('animate');
    }
};

const isPending = () => pendingPromises.size > 0;
const isPulling = () => pullStartY !== null;

const formatTime = (date) => {
    const twoDigits = (input) => input < 10 ? '0' + input : '' + input;
    return [date.getHours(), date.getMinutes(), date.getSeconds()]
        .map((segment) => segment < 10 ? '0' + segment : '' + segment)
        .join(':');
};

const updateLoaderState = () => {
    if (lastRefreshTime && isPending()) {
        loaderElement.classList.add('active');
    }
    else {
        loaderElement.classList.remove('active');
    }
};

const refreshView = (onRefresh) => {
    console.log('refreshView');
    const promise = timetables.fetchNearbyTimetables()
        .then((boardsData) => {
            console.log('rendering boards');
            pendingPromises.delete(promise);
            updateLoaderState();

            cardsHandles = dom.$all('.card');
            if (cardsHandles.length === 0) {
                cardsHandles = renderBoards(boardsData);
            }
            else {
                updateBoards(boardsData, cardsHandles);
            }
            if (!refreshHandle) {
                refreshHandle = setupRefresh(cardsHandles);
            }
            lastRefreshTime = new Date();

            if (onRefresh) {
                onRefresh();
            }
        }).catch((error) => {
            pendingPromises.delete(promise);
            updateLoaderState();
            onError(error);
        });
    pendingPromises.add(promise);
    updateLoaderState();
};

const updateCardsTransform = () => {
    let cardsTransform = `translateY(${Math.min(pullDiffY, pullDiffLimit)}px)`;
    let ratio = pullDiffY / pullDiffLimit;
    let pullIndicatorTranslateOffset = pullDiffY - pullDiffLimit;
    let pullIndicatorTransform = `translateY(${pullIndicatorTranslateOffset}px) scale(${ratio})`;

    cardsHandles.forEach((c) => c.style.transform = cardsTransform);
    pullIndicator.style.opacity = Math.max(ratio, 0.5);
    pullIndicator.style.transform = pullIndicatorTransform;
};

const onCardsTouchStart = (e) => {
    if(cardsContainer.scrollTop === 0 && !isPending()) {
        pullStartY = e.touches[0].clientY;
        cardsContainer.classList.add('pulled');
    }
};

const onCardsTouchMove = (e) => {
    if(pullStartY !== null) {
        pullDiffY = Math.min(e.touches[0].clientY - pullStartY, pullDiffLimit);
        if(pullDiffY > 0) {
            updateCardsTransform();
        }
    }
};

const onCardsTouchEnd = (e) => {
    cardsContainer.classList.remove('pulled');        

    if(pullDiffY > pullDiffLimit * 0.66 && !isPending()) {
        refreshView();
    }

    pullDiffY = 0;
    pullStartY = null;
    updateCardsTransform();
};

const renderBoards = (boards) => {
    const container = cardsContainer;
    const fragment = document.createDocumentFragment();
    const cards = boards.map(card.buildFullCard);

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    cards.forEach((card) => fragment.appendChild(card));
    container.appendChild(fragment);
    container.addEventListener('touchstart', onCardsTouchStart);
    container.addEventListener('touchmove', onCardsTouchMove);
    container.addEventListener('touchend', onCardsTouchEnd);

    return cards;
};

const updateBoards = (boardsData, cardsHandles) => {
    boardsData.forEach((boardData, index) => card.update(cardsHandles[index], boardData));
};

const setupRefresh = (cardsHandles) => {
    const refreshInterval = refreshIntervalInSeconds * 1000;

    return setInterval(() => {
        if(!isPulling() && !isPending()) {
            refreshView();
        }
    }, refreshInterval);
};

const waitAndHideSplash = () => {
    const splash = dom.$('#splash');
    if (splash) {
        splash.addEventListener('transitionend', () => {
            console.log('splash.transitionend');
            splash.parentNode.removeChild(splash);
        });
        splash.classList.add('hidden');
    }
};

const onInfo = (e) => {
    let version;

    cordova.getAppVersion()
        .catch(() => version = 'N/A')
        .then((v) => {
            version = version || v;
            let information = `Aplikacja wyświetla na żywo tablice rozkładowe przystanków znajdujących się w okolicy. Pobiera informacje z serwisu rozklady.lodz.pl i przedstawia je w wygodnej formie.\n\nDane odświeżane są automatycznie co ${refreshIntervalInSeconds} sekund.`;
            if (lastRefreshTime) {
                information += ` Ostatnia aktualizacja danych: ${formatTime(lastRefreshTime)}.`;
            }
            information += `\n\nWersja aplikacji: ${version}\n`;
            information += 'Kontakt: tabliceprzystankowe@gmail.com\n\nAutorem ikony "Bus" udostępnionej na bazie licencji CC 3.0 BY US jest Nikita Kozin.\nhttps://creativecommons.org/licenses/by/3.0/us/';

            navigator.notification.alert(information, null, 'Tablice Przystankowe');
        })
};

const onPause = () => {
    console.log('device.pause');
    cleanupHandles();
};

const onResume = () => {
    console.log('device.resume');
    cleanupHandles();
    refreshView(waitAndHideSplash);
};

const onDeviceReady = () => {
    console.log('document.deviceready');
    if (cordova.platformId == 'android') {
        StatusBar.backgroundColorByHexString('ee8801');
    }

    cardsContainer = dom.$('.cards');
    pullIndicator = dom.$('.pull-indicator');
    pullDiffLimit = pullIndicator.clientHeight;
    loaderElement = dom.$('.loader');
    splashElement = dom.$('#splash');
    dom.$('#menu-info').addEventListener('click', onInfo);
    document.addEventListener('pause', onPause);
    document.addEventListener('resume', onResume);

    refreshView(waitAndHideSplash);
};

document.addEventListener('deviceready', onDeviceReady);
