import { DOMHelper } from '../dom';
import { ProgressBar } from './progress-bar';

export class Splash {
    constructor(debugConsole) {
        this.debugConsole = debugConsole;

        this.element = DOMHelper.$('#splash');
        this.progressBar = new ProgressBar();
        this.retryButton = DOMHelper.$('#retry-button');
    }

    showRetryButton() {
        this.progressBar.hide();
        this.retryButton.removeAttribute('hidden');
        this.element.classList.remove('animate');
    }

    waitAndHide() {
        this.element.addEventListener('transitionend', () => {
            this.debugConsole.log('splash.transitionend');
            this.element.parentNode.removeChild(splash);
        });
        this.element.classList.add('hidden');
    }
}