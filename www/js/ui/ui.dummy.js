export { Events } from './ui';

export class DummyUI {
    constructor() {
        this.eventHandlers = {};
    }

    handleErrorMessage(e) {

    }

    on(name, callback) {
        this.eventHandlers[name] = callback;
    }

    showInfoModal(lastRefreshTime, refreshIntervalInSeconds) {

    }

    trigger(name, data) {
        if(this.eventHandlers[name]) {
            this.eventHandlers[name](data);
        }
    }

    updateProgress(progress) {

    }

    updateRefreshState(lastRefreshTime, isPending) {

    }
};