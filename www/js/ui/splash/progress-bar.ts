import { DOMHelper } from '../dom';

export class ProgressBar {
    private element: HTMLElement;
    private elementInner: HTMLElement;

    constructor() {
        this.element = DOMHelper.$('.progress-bar');
        this.elementInner = DOMHelper.$('.progress-bar-inner');
    }

    public hide(): void {
        this.element.setAttribute('hidden', 'hidden');
    }

    public update(progress: number): void {
        this.elementInner.style.width = `${progress * 100}%`;
    }
}