export { Events } from './ui';

const noop = () => { };

export class DummyUI {
    constructor() {
        this.eventHandlers = {};

        this.cardList = { update: noop };
        this.debugConsole = { log: noop };
        this.splash = { waitAndHide: noop };
    }

    handleErrorMessage(e) {}

    on(name, callback) {
        this.eventHandlers[name] = callback;
    }

    showInfoModal(lastRefreshTime, refreshIntervalInSeconds) {}

    showRefreshButton() {}

    trigger(name, data) {
        if (this.eventHandlers[name]) {
            this.eventHandlers[name](data);
        }
    }

    updateProgress(progress) {}

    updateRefreshState(lastRefreshTime, isPending) {}
};