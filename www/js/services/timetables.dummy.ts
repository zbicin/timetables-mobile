import { Departure, StopDepartures } from '../interfaces/index';

const noop = (atg: number) => { };

export class DummyTimetables {
    public fetchNearbyTimetables(updateCallback = noop, limit = 10) {
        const isJasmine = !!window['jasmine'];
        const result = [];

        for (let i = 0; i < limit; i++) {
            const dummyBoard = this.generateDummyBoard(i);
            result.push(dummyBoard);
        }

        setTimeout(() => updateCallback(0.25), 125);
        setTimeout(() => updateCallback(0.5), 250);
        setTimeout(() => updateCallback(0.75), 375);

        if (isJasmine) {
            updateCallback(1);
            return Promise.resolve(result);
        } else {
            return new Promise((resolve) => {
                setTimeout(() => {
                    updateCallback(1);
                    resolve(result)
                }, 500);
            });
        }
    }

    private formatTime(date: Date): string {
        return date.toISOString().split('T')[1].substr(0, 5);
    }

    private generateDummyBoard(index: number): StopDepartures {
        const now = new Date();
        const formattedNow = this.formatTime(now);

        const departures = [];
        const departuresCount = 10;

        for (let i = 0; i < departuresCount; i++) {
            const departure: Departure = {
                direction: `Direction #${index}`,
                number: index.toString(),
                time: `${i + 1} min`
            };

            departures.push(departure);
        }

        return {
            currentTime: formattedNow,
            departures: departures,
            id: index.toString(),
            name: `Dummy stop #${index}`
        };
    }
};