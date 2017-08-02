import reset from '../css/reset.css';
import style from '../css/style.css'

import 'core-js';
import 'konami-code-js';
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
const debugModeKey = 'debug';
const pendingPromises = new Set();
const refreshIntervalInSeconds = 30;
const timetables = Object.create(Timetables);

let cardsContainer;
let cardsHandles;
let debugConsole;
let lastRefreshTime;
let menuRefresh;
let splashElement;
let refreshHandle;

const cleanupHandles = () => {
    clearInterval(refreshHandle);
    pendingPromises.forEach((p) => p.cancel());
    pendingPromises.clear();
};

const log = (message) => {
    const line = dom.create('div', message);
    debugConsole.appendChild(line);
    debugConsole.scrollTop = debugConsole.scrollHeight;
    console.log(message);
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
    log(errorMessage);

    cleanupHandles();

    if(splashElement) {
        splashElement.classList.remove('animate');
    }
    if(menuRefresh) {
        menuRefresh.classList.remove('animate');
    }
};

const updateConsoleVisibility = () => {
    if(localStorage.getItem(debugModeKey)) {
        debugConsole.removeAttribute('hidden');
    } else {
        debugConsole.setAttribute('hidden', 'true');
    }
};

const isPending = () => pendingPromises.size > 0;

const formatTime = (date) => {
    const twoDigits = (input) => input < 10 ? '0' + input : '' + input;
    return [date.getHours(), date.getMinutes(), date.getSeconds()]
        .map((segment) => segment < 10 ? '0' + segment : '' + segment)
        .join(':');
};

const updateRefreshState = () => {
    if (lastRefreshTime && isPending()) {
        menuRefresh.classList.add('animate');
    }
    else {
        menuRefresh.classList.remove('animate');
    }
};

const refreshView = (onRefresh) => {
    log('refreshView');
    const promise = timetables.fetchNearbyTimetables()
        .then((boardsData) => {
            log('rendering boards');
            pendingPromises.delete(promise);
            updateRefreshState();

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
            updateRefreshState();
            onError(error);
        });
    pendingPromises.add(promise);
    updateRefreshState();
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

    return cards;
};

const updateBoards = (boardsData, cardsHandles) => {
    boardsData.forEach((boardData, index) => card.update(cardsHandles[index], boardData));
};

const setupRefresh = (cardsHandles) => {
    const refreshInterval = refreshIntervalInSeconds * 1000;

    return setInterval(() => {
        if(!isPending()) {
            refreshView();
        }
    }, refreshInterval);
};

const waitAndHideSplash = () => {
    const splash = dom.$('#splash');
    if (splash) {
        splash.addEventListener('transitionend', () => {
            log('splash.transitionend');
            splash.parentNode.removeChild(splash);
        });
        splash.classList.add('hidden');
    }
};

const onRefresh = (e) => {
    if(!isPending()) {
        refreshView();
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
    log('device.pause');
    cleanupHandles();
};

const onResume = () => {
    log('device.resume');
    cleanupHandles();
    refreshView(waitAndHideSplash);
};

const onKonamiCode = () => {
    if(localStorage.getItem(debugModeKey)) {
        localStorage.removeItem(debugModeKey);
    } else {
        localStorage.setItem(debugModeKey, true);
    }
    
    updateConsoleVisibility();
};

const onDeviceReady = () => {
    if (cordova.platformId == 'android') {
        StatusBar.backgroundColorByHexString('ee8801');
    }

    cardsContainer = dom.$('.cards');
    debugConsole = dom.$('.debug-console');
    menuRefresh = dom.$('#menu-refresh');
    splashElement = dom.$('#splash');

    dom.$('#menu-info').addEventListener('click', onInfo);
    menuRefresh.addEventListener('click', onRefresh);
    document.addEventListener('konamiCode', onKonamiCode);
    document.addEventListener('pause', onPause);
    document.addEventListener('resume', onResume);

    log('document.deviceready');
    refreshView(waitAndHideSplash);
    updateConsoleVisibility();
};

document.addEventListener('deviceready', onDeviceReady);
