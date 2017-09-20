import { Api } from '../api/api';
import { Departure } from '../interfaces/departure';
import { StopPosition } from '../interfaces/stopPosition';
import { StopDepartures } from '../interfaces/stopDepartures';
import { DummyGeolocation as Geolocation } from './geolocation.dummy';
import { Stop } from './stop';

const noop = (arg: number) => { };

export class Timetables {
    private api: Api;
    private stop: Stop;

    constructor() {
        this.api = new Api();
        this.stop = new Stop(this.api);
    }

    public fetchNearbyTimetables(updateProgressCallback = noop, limit = 10): Promise<StopDepartures[]> {
        let completedStepsCount = 0;
        const totalStepsCount = 1 + 1 + 1 + (limit + 1) + 1;
        return Geolocation.getCurrentPosition()
            .then((position: Position) => {
                updateProgressCallback(++completedStepsCount / totalStepsCount);
                return this.stop.getNearest(position.coords.latitude, position.coords.longitude, limit);
            }).then((nearestStopsDistances: StopPosition[]) => {
                updateProgressCallback(++completedStepsCount / totalStepsCount);
                return nearestStopsDistances.map((s) => s.id);
            }).then((stopsIds: number[]) => {
                updateProgressCallback(++completedStepsCount / totalStepsCount);
                return this.api.fetchTimetablesByStopsIds(stopsIds, () => updateProgressCallback(++completedStepsCount / totalStepsCount));
            }).then((responses) => {
                updateProgressCallback(++completedStepsCount / totalStepsCount);
                return responses.map(this.parseXmlDepartures)
            });
    }

    private parseXmlDepartures(rawXml: string): StopDepartures {
        const parser = new DOMParser();
        const doc = parser.parseFromString(rawXml, 'application/xml');
        const stop = doc.getElementsByTagName('Stop')[0];
        const nowTimeString = new Date().toISOString().split('T')[1].split(':').slice(0,2).join(':');
        const result: StopDepartures = {
            currentTime: doc.firstElementChild ? doc.firstElementChild.attributes.getNamedItem('time').value : nowTimeString,
            departures: [],
            id: stop.attributes.getNamedItem('id').value,
            name: stop.attributes.getNamedItem('name').value
        };

        const rows = doc.getElementsByTagName('R');

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const departure: Departure = {
                direction: row.attributes.getNamedItem('dir').value,
                number: row.attributes.getNamedItem('nr').value,
                time: row.firstElementChild.attributes.getNamedItem('t').value
            };
            result.departures.push(departure);
        }

        return result;
    }
}