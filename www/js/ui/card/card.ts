import { DOMHelper } from '../index';
import { StopDepartures } from '../../interfaces/index';

const expandedClassName = 'expanded';
const expendableClassName = 'expendable'; 

export class Card {
    private boardData: StopDepartures;
    private element: HTMLElement;

    constructor(boardData: StopDepartures) {
        this.boardData = boardData; 
        this.element = this.buildFullCard(boardData);
    }

    public update(boardData: StopDepartures): void { 
        this.boardData = boardData;

        const contents = this.buildContents(boardData);

        if (this.element.dataset.stopId !== boardData.id) {
            this.element.dataset.stopId = boardData.id;
            this.element.classList.remove(expandedClassName);
        }

        boardData.departures.length > 4
            ? this.element.classList.add(expendableClassName)
            : this.element.classList.remove(expendableClassName);

        boardData.departures.length === 0
            ? this.element.setAttribute('hidden', 'hidden')
            : this.element.removeAttribute('hidden');

        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }

        this.element.appendChild(contents);
    };

    private buildBody(boardData: StopDepartures): HTMLElement {
        const table = DOMHelper.create('table');
        table.classList.add('timetable');
        const body = DOMHelper.create('tbody');

        boardData.departures.map((departure) => {
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

    private buildContents(boardData: StopDepartures): DocumentFragment {
        const contents = document.createDocumentFragment();

        contents.appendChild(this.buildHeader(boardData.name));
        contents.appendChild(this.buildBody(boardData));

        return contents;
    }

    private buildFullCard(boardData: StopDepartures): HTMLElement {
        const card = DOMHelper.create('div');
        const contents = this.buildContents(boardData);

        if (boardData.departures.length > 4) {
            card.classList.add(expendableClassName);
        }

        card.dataset.stopId = boardData.id;
        card.classList.add('card');
        card.addEventListener('click', () => this.toggleExpand());
        card.appendChild(contents);

        return card;
    }

    private buildHeader(stopName: string): HTMLElement {
        return DOMHelper.create('h2', stopName);
    }

    private toggleExpand(): void {
        if (this.element.classList.contains(expandedClassName)) {
            this.element.classList.remove(expandedClassName);
        }
        else {
            this.element.classList.add(expandedClassName);
        }
    }  
}