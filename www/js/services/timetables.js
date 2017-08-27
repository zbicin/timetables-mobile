import { Api } from '../api/api';
import { Geolocation } from './geolocation';
import { Stop } from './stop';

import { Promise } from 'bluebird';

const noop = () => { };

export class Timetables {
    constructor() {
        this.api = new Api();
        this.stop = new Stop(this.api);
    }

    fetchNearbyTimetables(updateProgressCallback = noop, limit = 10) {
        let completedStepsCount = 0;
        const totalStepsCount = 1 + 1 + 1 + (limit + 1) + 1;
        return Geolocation.getCurrentPosition()
            .then((position) => {
                updateProgressCallback(++completedStepsCount / totalStepsCount);
                return this.stop.getNearest(position.coords.latitude, position.coords.longitude, limit)
            }).then((nearestStopsDistances) => {
                updateProgressCallback(++completedStepsCount / totalStepsCount);
                return nearestStopsDistances.map((s) => s.id);
            }).then((stopsIds) => {
                updateProgressCallback(++completedStepsCount / totalStepsCount);
                return this.api.fetchTimetablesByStopsIds(stopsIds, () => updateProgressCallback(++completedStepsCount / totalStepsCount));
            }).then((responses) => {
                updateProgressCallback(++completedStepsCount / totalStepsCount);
                return responses.map(this._parseXmlDepartures)
            });
    }

    _parseXmlDepartures(rawXml) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(rawXml, 'application/xml');
        const stop = doc.getElementsByTagName('Stop')[0];
        const nowTimeString = new Date().toISOString().split('T')[1].split(':').slice(0,2).join(':');
        const result = {
            currentTime: doc.firstElementChild ? doc.firstElementChild.attributes.time.value : nowTimeString,
            departures: [],
            stopId: stop.attributes['id'].value,
            stopName: stop.attributes['name'].value
        };

        const rows = doc.getElementsByTagName('R');

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const departure = {
                direction: row.attributes.dir.value,
                number: row.attributes.nr.value,
                time: row.firstElementChild.attributes.t.value
            };
            result.departures.push(departure);
        }

        return result;
    }
}