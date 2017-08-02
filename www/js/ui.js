import { Promise } from 'bluebird';

import { Card } from './card';
import { DOMHelper } from './dom';

const card = Object.create(Card);
const dom = Object.create(DOMHelper);
const debugModeKey = 'debug';

const elements = {
    cardsContainer: null,
    cards: null,
    debugConsole: null,
    menuInfo: null,
    menuRefresh: null,
    progressBar: null,
    progressBarInner: null,
    retryButton: null,
    splashElement: null
};

const addEventListener = (event, callback) => document.addEventListener(event, callback);

const generateBoardsDOM = (boards) => {
    const container = elements.cardsContainer;
    const fragment = document.createDocumentFragment();
    const cards = boards.map(card.buildFullCard);

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    cards.forEach((card) => fragment.appendChild(card));
    container.appendChild(fragment);

    return cards;
};

const formatTime = (date) => {
    const twoDigits = (input) => input < 10 ? '0' + input : '' + input;
    return [date.getHours(), date.getMinutes(), date.getSeconds()]
        .map((segment) => segment < 10 ? '0' + segment : '' + segment)
        .join(':');
};
// todo move to console
const log = (message) => {
    const line = dom.create('div', message);
    elements.debugConsole.appendChild(line);
    elements.debugConsole.scrollTop = elements.debugConsole.scrollHeight;
    console.log(message);
};

const showErrorMessage = (e) => {
    let errorMessage;
    let information;

    if (e instanceof XMLHttpRequest) {
        errorMessage = e.statusText || e.status;
        information = `Wystąpił problem z połączeniem internetowym. Sprawdź ustawienia telefonu i spróbuj ponownie (${errorMessage}).`;
    } else if (e.toString().indexOf('PositionError') > -1) {
        errorMessage = e.code;
        information = `Nie udało się ustalić Twojego położenia. Sprawdź ustawienia lokalizacji w swoim urządzeniu i spróbuj ponownie (kod błędu: ${errorMessage}).`;
    } else {
        errorMessage = e.message || e.code || e;
        information = `Nie udało się pobrać danych przystanków w okolicy. Upewnij się, że masz włączone usługi lokalizacji oraz dostęp do Internetu, a następnie uruchom ponownie aplikację. (${errorMessage})`;
    }
    navigator.notification.alert(information, null, '¯\\_(ツ)_/¯');
    console.error(e);
    log(errorMessage);

    if (elements.progressBar) {
        elements.progressBar.setAttribute('hidden', true);
    }
    if (elements.splashElement) {
        elements.retryButton.removeAttribute('hidden');
        elements.splashElement.classList.remove('animate');
    }
    if (elements.menuRefresh) {
        elements.menuRefresh.classList.remove('animate');
    }
};

const onFetchUpdate = (progress) => {
    elements.progressBarInner.style.width = `${progress * 100}%`;
};

const reload = () => location.reload();

const renderBoards = (boardsData) => {
    log('rendering boards');
    updateRefreshState();

    elements.cards = dom.$all('.card');
    if (elements.cards.length === 0) {
        elements.cards = generateBoardsDOM(boardsData);
    }
    else {
        updateBoardsDOM(boardsData, elements.cards);
    }
    elements.progressBar.setAttribute('hidden', true);
};

const showInfoMessage = (lastRefreshTime, refreshIntervalInSeconds) => {
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
        });
};

const updateBoardsDOM = (boardsData, cardsHandles) => {
    boardsData.forEach((boardData, index) => card.update(cardsHandles[index], boardData));
};

const updateConsoleVisibility = () => {
    if (localStorage.getItem(debugModeKey)) {
        elements.debugConsole.removeAttribute('hidden');
    } else {
        elements.debugConsole.setAttribute('hidden', 'true');
    }
};

const updateRefreshState = (lastRefreshTime, isPending) => {
    if (lastRefreshTime && isPending) {
        elements.menuRefresh.classList.add('animate');
    }
    else {
        elements.menuRefresh.classList.remove('animate');
    }
};

const waitAndHideSplash = () => {
    if (elements.splashElement) {
        elements.splashElement.addEventListener('transitionend', () => {
            log('splash.transitionend');
            elements.splashElement.parentNode.removeChild(splash);
        });
        elements.splashElement.classList.add('hidden');
    }
};

const init = () => {
    if (cordova.platformId == 'android') {
        StatusBar.backgroundColorByHexString('ee8801');
    }

    elements.cardsContainer = dom.$('.cards');
    elements.debugConsole = dom.$('.debug-console');
    elements.menuInfo = dom.$('#menu-info');
    elements.menuRefresh = dom.$('#menu-refresh');
    elements.progressBar = dom.$('.progress-bar');
    elements.progressBarInner = dom.$('.progress-bar-inner');
    elements.retryButton = dom.$('#retry-button');
    elements.splashElement = dom.$('#splash');
};

export const UI = {
    elements,

    addEventListener,
    init,
    log,
    reload,
    renderBoards,
    showInfoMessage,
    showErrorMessage,
    updateConsoleVisibility,
    updateRefreshState,
    waitAndHideSplash
};