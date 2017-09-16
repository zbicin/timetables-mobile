import { DOMHelper } from './dom';

const debugModeStorageKey = 'debug';

export class DebugConsole {
    private element: HTMLElement;

    constructor() {
        this.element = DOMHelper.$('.debug-console');

        this.updateVisibility();
    }

    public isVisible(): boolean {
        return localStorage.getItem(debugModeStorageKey) === 'true'; 
    }

    public log(message: any): void {
        console.log(message);
        const line = DOMHelper.create('div', message.toString());
        this.element.appendChild(line);
        this.element.scrollTop = this.element.scrollHeight;
    }

    public toggleVisibilityStatus(): void {
        if (this.isVisible()) {
            localStorage.removeItem(debugModeStorageKey);
        } else {
            localStorage.setItem(debugModeStorageKey, 'true');
        }
    }

    public updateVisibility(): void {
        if (this.isVisible()) {
            this.element.removeAttribute('hidden');
        } else {
            this.element.setAttribute('hidden', 'true');
        }
    }
}
