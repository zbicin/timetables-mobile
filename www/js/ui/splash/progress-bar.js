import { DOMHelper } from '../dom';

export class ProgressBar {
    constructor() {
        this.element = DOMHelper.$('.progress-bar');
        this.elementInner = DOMHelper.$('.progress-bar-inner');
    }

    hide() {
        this.element.setAttribute('hidden', true);
    }

    update(progress) {
        this.elementInner.style.width = `${progress * 100}%`;
    }
}