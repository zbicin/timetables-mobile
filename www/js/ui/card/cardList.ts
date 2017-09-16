import { Card } from './card';
import { DOMHelper } from '../index';

export class CardList {
    private cards: Card[];
    private element: HTMLElement;

    constructor(boardsData = []) {
        this.cards = [];
        this.element = DOMHelper.$('.cards');

        this.update(boardsData);
    }

    public update(boardsData) {
        this.cards = this._buildCards(boardsData);
    }

    _buildCards(boardsData) {
        const fragment = document.createDocumentFragment();
        const cards = boardsData.map((b) => new Card(b));

        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }

        cards.forEach((card) => fragment.appendChild(card.element));
        this.element.appendChild(fragment);

        return cards;
    }
}