import { DOMHelper } from './dom';

const debugModeStorageKey = 'debug';

export class DebugConsole {
    constructor() {
        this.element = DOMHelper.$('.debug-console');

        this.updateVisibility();
    }

    isVisible() {
        return localStorage.getItem(debugModeStorageKey); 
    }

    log(message) {
        console.log(message);
        const line = DOMHelper.create('div', message);
        this.element.appendChild(line);
        this.element.scrollTop = this.element.scrollHeight;
    }

    toggleVisibilityStatus() {
        if (this.isVisible()) {
            localStorage.removeItem(debugModeStorageKey);
        } else {
            localStorage.setItem(debugModeStorageKey, true);
        }
    }

    updateVisibility() {
        if (this.isVisible()) {
            this.element.removeAttribute('hidden');
        } else {
            this.element.setAttribute('hidden', 'true');
        }
    }
};
