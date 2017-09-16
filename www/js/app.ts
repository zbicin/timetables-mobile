import { Events, UI } from './ui/index';
import { StopDepartures } from './interfaces/index';
import { Timetables } from './services/index';
// import { DummyTimetables as Timetables } from './services/timetables.dummy';
const noop = () => { };

export class App {
    private hasCrashed: boolean;
    private lastRefreshTime: Date;
    private pendingPromises: Set<Promise<any>>;
    private refreshHandle: number;
    private refreshIntervalInSeconds: number;
    private timetables: Timetables;
    private ui: UI;
    
    constructor(Timetables, UI) {
        this.hasCrashed = false;
        this.lastRefreshTime = null;
        this.pendingPromises = new Set();
        this.refreshHandle = null;
        this.refreshIntervalInSeconds = 30;
        this.timetables = new Timetables();

        this.ui = new UI();
        this.ui.on(Events.DevicePause, (e) => this.onDevicePause(e));
        this.ui.on(Events.DeviceReady, (e) => this.onDeviceReady(e));
        this.ui.on(Events.DeviceResume, (e) => this.onDeviceResume(e));
        this.ui.on(Events.InfoClick, (e) => this.onInfoClick(e));
        this.ui.on(Events.RefreshClick, (e) => this.onRefreshClick(e));
        this.ui.on(Events.RetryClick, (e) => this.onRetryClick(e));
    }

    private cleanupHandles(): void {
        this.ui.debugConsole.log('app.cleanupHandles');
        clearInterval(this.refreshHandle);
        this.refreshHandle = null;
        // this.pendingPromises.forEach((p) => p.cancel());
        this.pendingPromises.clear();
    }

    private isPending(): boolean {
        return this.pendingPromises.size > 0;
    }

    private onDevicePause(e: any): void {
        this.ui.debugConsole.log('device.pause');
        this.cleanupHandles();
    }

    private onDeviceReady(e: any): void {
        this.ui.debugConsole.log('device.ready');
        this.refresh(() => {
            this.ui.splash.waitAndHide();
            this.ui.showRefreshButton();
            this.ui.showTitle();
        });
    }

    onDeviceResume(e: any): void {
        this.ui.debugConsole.log('device.resume');
        this.cleanupHandles();

        if (!this.hasCrashed) {
            this.refresh(() => {
                this.ui.splash.waitAndHide();
                this.ui.showRefreshButton();
                this.ui.showTitle();
            });
        }
    }

    private onError(e: any): void {
        this.hasCrashed = true;
        this.ui.handleErrorMessage(e);
        this.cleanupHandles();
    }

    private onInfoClick(e: any): void {
        this.ui.showInfoModal(this.lastRefreshTime, this.refreshIntervalInSeconds);
    }

    private onRefreshClick(e: any): void {
        if (!this.isPending()) {
            this.refresh();
        }
    }

    private onRetryClick(e: any): void {
        location.reload();
    }

    private refresh(onRefresh = noop): void {
        this.ui.debugConsole.log('app.refresh');
        const promise = this.timetables.fetchNearbyTimetables((p) => this.ui.updateProgress(p))
            .then((boardsData) => this.timeoutPromise<StopDepartures[]>(boardsData, 100))
            .then((boardsData) => {
                if (!this.refreshHandle) {
                    this.refreshHandle = this.setupRefreshInterval();
                }
                this.pendingPromises.delete(promise);
                this.ui.cardList.update(boardsData);
                this.lastRefreshTime = new Date();
                this.ui.updateRefreshState(this.lastRefreshTime, this.isPending());
                onRefresh();
            }).catch((error) => {
                this.pendingPromises.delete(promise);
                this.onError(error);
            });
        this.pendingPromises.add(promise);
        this.ui.updateRefreshState(this.lastRefreshTime, this.isPending());
    }

    private setupRefreshInterval(): number {
        this.ui.debugConsole.log('app.setupRefreshInteval');
        const refreshInterval = this.refreshIntervalInSeconds * 1000;

        return setInterval(() => {
            if (!this.isPending()) {
                this.refresh();
            }
        }, refreshInterval);
    }

    private timeoutPromise<T>(data: T, timeout: number): Promise<T> {
        const isJasmine = !!(window as any).jasmine;

        return isJasmine
            ? Promise.resolve(data)
            : new Promise((resolve) => setTimeout(() => resolve(data), timeout));
    }
};
