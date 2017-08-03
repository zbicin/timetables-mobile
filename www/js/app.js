import { Events } from './ui/ui';
// import { DummyTimetables as Timetables } from './services/timetables.dummy';
import { Timetables } from './services/timetables';

const noop = () => { };

export class App {
    constructor(UI) {
        this.lastRefreshTime = null;
        this.pendingPromises = new Set();
        this.refreshHandle = null;
        this.refreshIntervalInSeconds = 30;
        this.timetables = new Timetables();

        this.ui = new UI();
        this.ui.on(Events.DevicePause, (e) => this._onDevicePause(e));
        this.ui.on(Events.DeviceReady, (e) => this._onDeviceReady(e));
        this.ui.on(Events.DeviceResume, (e) => this._onDeviceResume(e));
        this.ui.on(Events.InfoClick, (e) => this._onInfoClick(e));
        this.ui.on(Events.RefreshClick, (e) => this._onRefreshClick(e));
        this.ui.on(Events.RetryClick, (e) => this._onRetryClick(e));
    }

    _cleanupHandles() {
        this.ui.debugConsole.log('app.cleanupHandles');
        clearInterval(this.refreshHandle);
        this.refreshHandle = null;
        this.pendingPromises.forEach((p) => p.cancel());
        this.pendingPromises.clear();
    }

    _isPending() {
        return this.pendingPromises.size > 0;
    }

    _onDevicePause() {
        this.ui.debugConsole.log('device.pause');
        this._cleanupHandles();
    }

    _onDeviceReady() {
        this.ui.debugConsole.log('device.ready');
        this._refresh(() => this.ui.splash.waitAndHide());
    }

    _onDeviceResume() {
        this.ui.debugConsole.log('device.resume');
        this._cleanupHandles();
        this._refresh(() => this.ui.splash.waitAndHide());
    }

    _onError(e) {
        this.ui.handleErrorMessage(e);
        this._cleanupHandles();
    }

    _onInfoClick() {
        this.ui.showInfoModal(this.lastRefreshTime, this.refreshIntervalInSeconds);
    }

    _onRefreshClick() {
        if (!this._isPending()) {
            this._refresh();
        }
    }

    _onRetryClick() {
        location.reload();
    }

    _refresh(onRefresh = noop) {
        this.ui.debugConsole.log('app.refresh');
        const promise = this.timetables.fetchNearbyTimetables((p) => this.ui.updateProgress(p))
            .then((boardsData) => this._timeoutPromise(boardsData, 100))
            .then((boardsData) => {
                if (!this.refreshHandle) {
                    this.refreshHandle = this._setupRefreshInterval();
                }
                this.pendingPromises.delete(promise);
                this.ui.cardList.update(boardsData);
                this.lastRefreshTime = new Date();
                this.ui.updateRefreshState(this.lastRefreshTime, this._isPending());
                onRefresh();
            }).catch((error) => {
                this.pendingPromises.delete(promise);
                this._onError(error);
            });
        this.pendingPromises.add(promise);
        this.ui.updateRefreshState(this.lastRefreshTime, this._isPending());
    }

    _setupRefreshInterval() {
        this.ui.debugConsole.log('app.setupRefreshInteval');
        const refreshInterval = this.refreshIntervalInSeconds * 1000;

        return setInterval(() => {
            if (!this._isPending()) {
                this._refresh();
            }
        }, refreshInterval);
    }

    _timeoutPromise(data, timeout) {
        return new Promise((resolve) => setTimeout(() => resolve(data), timeout));
    }
};
