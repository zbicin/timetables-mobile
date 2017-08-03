import { Promise } from 'bluebird';

const noop = () => { };

export class DummyTimetables {
    fetchNearbyTimetables(updateCallback = noop, limit = 10) {
        const result = [];

        for (let i = 0; i < limit; i++) {
            const dummyBoard = this._generateDummyBoard(i);
            result.push(dummyBoard);
        }

        setTimeout(() => updateCallback(0.25), 125);
        setTimeout(() => updateCallback(0.5), 250);
        setTimeout(() => updateCallback(0.75), 375);

        return new Promise((resolve) => {
            setTimeout(() => {
                updateCallback(1);
                resolve(result)
            }, 500);
        });
    }

    _formatTime(date) {
        return date.toISOString().split('T')[1].substr(0, 5);
    }

    _generateDummyBoard(index) {
        const now = new Date();
        const formattedNow = this._formatTime(now);

        const departures = [];
        const departuresCount = 10;

        for (let i = 0; i < departuresCount; i++) {
            const departure = {
                direction: `Direction #${index}`,
                number: index.toString(),
                time: `${i + 1} min`
            };

            departures.push(departure);
        }

        return {
            currentTime: formattedNow,
            stopId: index.toString(),
            stopName: `Dummy stop #${index}`,
            departures: departures
        };
    }
};