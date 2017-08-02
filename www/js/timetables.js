import { Api } from './api';
import { Geolocation } from './geolocation';
import { Stop } from './stop';

import { Promise } from 'bluebird';

const api = Object.create(Api);
const geolocation = Object.create(Geolocation);
const noop = () => {};
const stop = Object.create(Stop);

const parseXmlDepartures = (rawXml) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawXml, 'application/xml');
    const stop = doc.getElementsByTagName('Stop')[0];
    const result = {
        currentTime: doc.firstElementChild.attributes.time.value,
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
};

const fetchNearbyTimetables = (updateCallback = noop, limit = 10) => {
    let completedStepsCount = 0;
    const totalStepsCount = 1 + 1 + 1 + (limit + 1) + 1;
    return geolocation.getCurrentPosition()
        .then((position) => {
            updateCallback(++completedStepsCount / totalStepsCount);
            return stop.getNearest(position.coords.latitude, position.coords.longitude, limit)
        }).then((nearestStopsDistances) => {
            updateCallback(++completedStepsCount / totalStepsCount);
            return nearestStopsDistances.map((s) => s.id);
        }).then((stopsIds) => {
            updateCallback(++completedStepsCount / totalStepsCount);
            return api.fetchTimetablesByStopsIds(stopsIds, () => updateCallback(++completedStepsCount / totalStepsCount));
        }).then((responses) => {
            updateCallback(++completedStepsCount / totalStepsCount);
            return responses.map(parseXmlDepartures)
        });
};

export const Timetables = {
    fetchNearbyTimetables
};