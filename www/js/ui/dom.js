export class DOMHelper {
    static $(selector) {
        return document.querySelector(selector);
    }

    static $all(selector) {
        return document.querySelectorAll(selector);
    }

    static create(tagName, text) {
        const element = document.createElement(tagName);
        if (text) {
            element.innerHTML = text;
        }
        return element;
    }
};
