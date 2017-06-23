import { Http } from './http';
import { Geolocation } from './geolocation';
import { Stop } from './stop';

import { Promise } from 'bluebird';

const http = Object.create(Http);
const geolocation = Object.create(Geolocation);
const stop = Object.create(Stop);

const fetchCookie = () => http.head('http://rozklady.lodz.pl');

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
}

const fetchTimetablesByStopsIds = (stopIds) => {
    const promises = stopIds.map((stopId) => {
        return http.get(`http://rozklady.lodz.pl/Home/GetTimetableReal?busStopId=${stopId}`)
            .then((response) => {
                const parsed = parseXmlDepartures(response.responseText);
                return Promise.resolve(parsed);
            });
    });

    return Promise.all(promises);
}

const fetchNearbyTimetables = (limit = 10) => fetchCookie()
    .then(() => geolocation.getCurrentPosition())
    .then((position) => stop.getNearest(position.coords.latitude, position.coords.longitude, limit))
    .then((nearestStopsDistances) => {
        const extractId = (nearestStopDistance) => nearestStopDistance.id;
        return Promise.resolve(nearestStopsDistances.map(extractId));
    }).then((stopsIds) => fetchTimetablesByStopsIds(stopsIds));

export const Timetables = {
    fetchNearbyTimetables
};