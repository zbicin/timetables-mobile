import { Api } from './api';
import { Geolocation } from './geolocation';
import { Stop } from './stop';

import { Promise } from 'bluebird';

const api = Object.create(Api);
const geolocation = Object.create(Geolocation);
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

const fetchNearbyTimetables = (limit = 10) => geolocation.getCurrentPosition()
    .then((position) => stop.getNearest(position.coords.latitude, position.coords.longitude, limit))
    .then((nearestStopsDistances) => nearestStopsDistances.map((s) => s.id))
    .then((stopsIds) => api.fetchTimetablesByStopsIds(stopsIds))
    .then((responses) => responses.map(parseXmlDepartures));

export const Timetables = {
    fetchNearbyTimetables
};