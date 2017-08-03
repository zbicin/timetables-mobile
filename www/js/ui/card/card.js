import { DOMHelper } from '../dom';

const expandedClassName = 'expanded';
const expendableClassName = 'expendable';

export class Card {
    constructor(boardData) {
        this.boardData = boardData;
        this.element = this._buildFullCard();
    }

    update(boardData) {
        const contents = this._buildContents(boardData);

        if (this.element.dataset.stopId !== boardData.stopId) {
            this.element.dataset.stopId = boardData.stopId;
            this.element.classList.remove(expandedClassName);
        }

        boardData.departures.length > 4
            ? this.element.classList.add(expendableClassName)
            : this.element.classList.remove(expendableClassName);

        boardData.departures.length === 0
            ? this.element.setAttribute('hidden', true)
            : this.element.removeAttribute('hidden');

        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }

        this.element.appendChild(contents);
    };

    _buildBody() {
        const table = DOMHelper.create('table');
        table.classList.add('timetable');
        const body = DOMHelper.create('tbody');

        this.boardData.departures.map((departure) => {
            const row = DOMHelper.create('tr');
            const numberCell = DOMHelper.create('td', departure.number);
            const directionCell = DOMHelper.create('td', departure.direction);
            const timeCell = DOMHelper.create('td', departure.time);

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


    _buildContents() {
        const boardData = this.boardData;
        const contents = document.createDocumentFragment();

        contents.appendChild(this._buildHeader(boardData));
        contents.appendChild(this._buildBody(boardData));

        return contents;
    }

    _buildFullCard() {
        const boardData = this.boardData;
        const card = DOMHelper.create('div');
        const contents = this._buildContents();

        if (boardData.departures.length > 4) {
            card.classList.add(expendableClassName);
        }

        card.dataset.stopId = boardData.stopId;
        card.classList.add('card');
        card.addEventListener('click', () => this._toggleExpand());
        card.appendChild(contents);

        return card;
    }

    _buildHeader() {
        return DOMHelper.create('h2', this.boardData.stopName);
    }

    _toggleExpand() {
        if (this.element.classList.contains(expandedClassName)) {
            this.element.classList.remove(expandedClassName);
        }
        else {
            this.element.classList.add(expandedClassName);
        }
    }

    

}