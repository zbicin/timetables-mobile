const Modal = (function () {
    const dom = Object.create(DOMHelper);

    const build = (text, actionCallback) => {
        const textElement = dom.create('p', text);
        const button = dom.create('button', 'OK');
        const result = document.createDocumentFragment();

        button.addEventListener('click', actionCallback);

        result.appendChild(textElement);
        result.appendChild(button);

        return result;
    }

    return {
        build
    };
})();