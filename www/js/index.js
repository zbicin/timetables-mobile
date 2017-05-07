const dom = Object.create(DOMHelper);
const timetables = Object.create(Timetables);
const card = Object.create(Card);
const modal = Object.create(Modal);

const show = (element) => element.classList.remove('hidden');
const hide = (element) => element.classList.add('hidden');

const renderBoards = (boards) => {
    const container = document.querySelector('.cards');

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    boards.map(card.build).forEach((card) => {
        container.appendChild(card);
    });
}

const animateSplash = () => {
    let direction = 'up';
    const splash = dom.$('.splash');
    const transforms = {
        up: 'translateY(-20px)',
        down: 'translateY(0px)',
        out: 'translateY(calc(-100% + 60px))'
    }

    const changeDirection = () => {
        if (direction === 'out') {
            splash.removeEventListener('transitionend', changeDirection);
        } else {
            direction = direction === 'down' ? 'up' : 'down';
        }
        splash.style.transform = transforms[direction];
    }

    splash.addEventListener('transitionend', changeDirection);
    changeDirection();

    return (outCallback) => {
        direction = 'out';
        splash.addEventListener('transitionend', outCallback);
    };
}

const setupModal = (identifier, actionCallback) => {
    const backdropElement = dom.$('.backdrop');
    const modalElement = dom.$(`#modal-${identifier}`);
    modalElement.lastChild.addEventListener('click', (event) => {
        event.preventDefault();

        if (actionCallback) {
            actionCallback();
        }

        hide(modalElement);
        hide(backdropElement);
    });
};

const showModal = (identifier) => {
    const backdropElement = dom.$('.backdrop');
    const modalElement = dom.$(`#modal-${identifier}`);
    show(modalElement);
    show(backdropElement);
}

const errorHandler = (e) => {
    showModal('error');
    console.error(e);
}

const onDeviceReady = () => {
    const stopAnimateSplash = animateSplash();

    setupModal('info');
    setupModal('error');
    dom.$('#menu-info').addEventListener('click', () => showModal('info'));
    dom.$('#menu-refresh').addEventListener('click', () => location.reload());

    timetables.fetchNearbyTimetables()
        .then((boards) => {
            renderBoards(boards);
            stopAnimateSplash(() => show(dom.$('#menu-refresh')));
        }).catch(errorHandler);
};

document.addEventListener('deviceready', onDeviceReady);
