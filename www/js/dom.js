const $ = (selector) => document.querySelector(selector);
const $all = (selector) => document.querySelectorAll(selector);
const create = (tagName, text) => {
    const element = document.createElement(tagName);
    if (text) {
        element.innerHTML = text;
    }
    return element;
}

export const DOMHelper = {
    $, $all, create
};
