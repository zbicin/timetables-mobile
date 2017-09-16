export class DOMHelper {
    static $(selector: string): HTMLElement {
        return document.querySelector(selector) as HTMLElement;
    }

    static $all(selector: string): NodeListOf<HTMLElement> {
        return document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
        
    }

    static create(tagName: string, text?: string): HTMLElement {
        const element = document.createElement(tagName);
        if (text) {
            element.innerHTML = text;
        }
        return element;
    }
};
