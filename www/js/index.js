import reset from '../css/reset.css';
import style from '../css/style.css'

import 'core-js';
import 'konami-code-js';
import { UI } from './ui';
// import { DummyTimetables as Timetables } from './timetables.dummy';
import { Timetables } from './timetables';

import { Promise } from 'bluebird';
Promise.config({
    cancellation: true
});

const noop = () => {};
const pendingPromises = new Set();
const refreshIntervalInSeconds = 30;
const ui = Object.create(UI);
const timetables = Object.create(Timetables);

let lastRefreshTime;
let refreshHandle;

const cleanupHandles = () => {
    clearInterval(refreshHandle);
    pendingPromises.forEach((p) => p.cancel());
    pendingPromises.clear();
};

const onError = (e) => {
    ui.showErrorMessage(e);
    cleanupHandles();
};

const isPending = () => pendingPromises.size > 0;

const timeout = (data, timeout) => new Promise((resolve) => setTimeout(() => resolve(data), timeout));

const refresh = (onRefresh = noop) => {
    ui.log('refresh');
    const promise = timetables.fetchNearbyTimetables(ui.onFetchUpdate)
        .then((boardsData) => timeout(boardsData, 100))
        .then((boardsData) => {
            if (!refreshHandle) {
                refreshHandle = setupRefresh(ui.elements.cards);
            }
            pendingPromises.delete(promise);
            ui.renderBoards(boardsData);
            lastRefreshTime = new Date();
            onRefresh();
        }).catch((error) => {
            pendingPromises.delete(promise);
            onError(error);
        });
    pendingPromises.add(promise);
    ui.updateRefreshState(lastRefreshTime, isPending());
};

const setupRefresh = (cardsHandles) => {
    const refreshInterval = refreshIntervalInSeconds * 1000;

    return setInterval(() => {
        if (!isPending()) {
            refresh();
        }
    }, refreshInterval);
};

const onRefreshButton = (e) => {
    if (!isPending()) {
        refresh();
    }
};

const onInfo = (e) => {
    ui.showInfoMessage(lastRefreshTime, refreshIntervalInSeconds);
};

const onPause = () => {
    ui.log('device.pause');
    cleanupHandles();
};

const onResume = () => {
    ui.log('device.resume');
    cleanupHandles();
    refresh(ui.waitAndHideSplash);
};

const onKonamiCode = () => {
    if (localStorage.getItem(debugModeKey)) {
        localStorage.removeItem(debugModeKey);
    } else {
        localStorage.setItem(debugModeKey, true);
    }

    ui.updateConsoleVisibility();
};

const onRetryButton = () => {
    location.reload();
};

const onDeviceReady = () => {
    ui.init();
    
    ui.elements.menuInfo.addEventListener('click', onInfo);
    ui.elements.menuRefresh.addEventListener('click', onRefreshButton);
    ui.elements.retryButton.addEventListener('click', onRetryButton);
    document.addEventListener('konamiCode', onKonamiCode);
    document.addEventListener('pause', onPause);
    document.addEventListener('resume', onResume);

    ui.log('document.deviceready');
    refresh(ui.waitAndHideSplash);
    ui.updateConsoleVisibility();
};

document.addEventListener('deviceready', onDeviceReady);
