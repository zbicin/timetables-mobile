import { DOMHelper } from './dom';

const expandedClassName = 'expanded';
const expendableClassName = 'expendable';
const dom = Object.create(DOMHelper);

const createCardHeader = (board) => dom.create('h2', board.stopName);

const createCardBody = (board) => {
    const table = dom.create('table');
    table.classList.add('timetable');
    const body = dom.create('tbody');

    board.departures.map((departure) => {
        const row = dom.create('tr');
        const numberCell = dom.create('td', departure.number);
        const directionCell = dom.create('td', departure.direction);
        const timeCell = dom.create('td', departure.time);

        row.appendChild(numberCell);
        row.appendChild(directionCell);
        row.appendChild(timeCell);

        return row;
    }).forEach((row) => {
        body.appendChild(row);
    });

    table.appendChild(body);
    return table;
}

const toggleExpand = (event) => {
    const target = event.currentTarget;

    if (target.classList.contains(expandedClassName)) {
        target.classList.remove(expandedClassName);
    }
    else {
        target.classList.add(expandedClassName);
    }
};

const buildContents = (boardData) => {
    const contents = document.createDocumentFragment();

    contents.appendChild(createCardHeader(boardData));
    contents.appendChild(createCardBody(boardData));

    return contents;
};

const buildFullCard = (boardData) => {
    const card = dom.create('div');
    const contents = buildContents(boardData);

    if(boardData.departures.length > 4) {
        card.classList.add(expendableClassName);
    }

    card.dataset.stopId = boardData.stopId;
    card.classList.add('card');
    card.addEventListener('click', toggleExpand);
    card.appendChild(contents);

    return card;
};

const update = (card, boardData) => {
    const contents = buildContents(boardData);

    if (card.dataset.stopId !== boardData.stopId) {
        card.dataset.stopId = boardData.stopId;
        card.classList.remove(expandedClassName);
    }

    boardData.departures.length > 4
        ? card.classList.add(expendableClassName)
        : card.classList.remove(expendableClassName);

    while (card.firstChild) {
        card.removeChild(card.firstChild);
    }

    card.appendChild(contents);
};


export const Card = {
    buildFullCard,
    buildContents,
    update
};