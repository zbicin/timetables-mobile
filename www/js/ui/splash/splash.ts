import { DebugConsole, DOMHelper } from '../index';
import { ProgressBar } from './progress-bar';

const noop = () => {};

export class Splash {
    public progressBar: ProgressBar;
    public retryButton: HTMLElement;
    
    private debugConsole: DebugConsole;
    private element: HTMLElement;

    constructor(debugConsole: DebugConsole) {
        this.debugConsole = debugConsole;

        this.element = DOMHelper.$('#splash');
        this.progressBar = new ProgressBar();
        this.retryButton = DOMHelper.$('#retry-button');
    }

    public showRetryButton(): void {
        this.progressBar.hide();
        this.retryButton.removeAttribute('hidden');
        this.element.classList.remove('animate');
    }

    public waitAndHide(callback = noop): void {
        this.element.addEventListener('transitionend', () => {
            this.debugConsole.log('splash.transitionend');
            this.element.parentNode.removeChild(this.element);
            callback();
        });
        this.element.classList.add('hidden');
    }
}