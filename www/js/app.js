import { UI } from './ui';
// import { DummyTimetables as Timetables } from './timetables.dummy';
import { Timetables } from './timetables';

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
                refreshHandle = setupRefreshInterval(ui.elements.cards);
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

const setupRefreshInterval = (cardsHandles) => {
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

const onInfoButton = (e) => {
    ui.showInfoMessage(lastRefreshTime, refreshIntervalInSeconds);
};

const onDevicePause = () => {
    ui.log('device.pause');
    cleanupHandles();
};

const onDeviceResume = () => {
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

const onRetryButton = () => ui.reload();

const onDeviceReady = () => {
    ui.init();
    
    ui.elements.menuInfo.addEventListener('click', onInfoButton);
    ui.elements.menuRefresh.addEventListener('click', onRefreshButton);
    ui.elements.retryButton.addEventListener('click', onRetryButton);
    ui.addEventListener('konamiCode', onKonamiCode);
    ui.addEventListener('pause', onDevicePause);
    ui.addEventListener('resume', onDeviceResume);

    ui.log('document.deviceready');
    refresh(ui.waitAndHideSplash);
    ui.updateConsoleVisibility();
};

const init = () => ui.addEventListener('deviceready', onDeviceReady);

export const App = {
    init
};