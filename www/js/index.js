const dom = Object.create(DOMHelper);
const timetables = Object.create(Timetables);
const card = Object.create(Card);
const modal = Object.create(Modal);

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

const errorHandler = (e) => {
    navigator.notification.alert(e.message || e, null, 'Coś poszło nie tak');
    console.error(e);
}

const onInfo = (e) => {
    navigator.notification.alert('Wygodny klient rozkładów jazdy dostępnych na stronie rozklady.lodz.pl.', null, 'Tablice Przystankowe');
}

const onDeviceReady = () => {
    if (cordova.platformId == 'android') {
        StatusBar.backgroundColorByHexString('ee8801');
    }

    const stopAnimateSplash = animateSplash();

    dom.$('#menu-info').addEventListener('click', onInfo);
    dom.$('#menu-refresh').addEventListener('click', () => location.reload());

    timetables.fetchNearbyTimetables()
        .then((boards) => {
            renderBoards(boards);
            stopAnimateSplash(() => dom.$('#menu-refresh').classList.remove('hidden'));
        }).catch(errorHandler);
};

document.addEventListener('deviceready', onDeviceReady);
