const Card = ((function () {
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
        const expandedClassName = 'expanded';
        const target = event.currentTarget;

        if(target.classList.contains(expandedClassName)) {
            target.classList.remove(expandedClassName);
        }
        else {
            target.classList.add(expandedClassName);
        }
    }

    const build = (boardData) => {
        const card = dom.create('div');
        card.classList.add('card');

        card.appendChild(createCardHeader(boardData));
        card.appendChild(createCardBody(boardData));

        card.addEventListener('click', toggleExpand);

        return card;
    }

    return {
        build
    };
})());

