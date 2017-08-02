import { Http } from './http';

import { Promise } from 'bluebird';

const apiUrlBase = 'http://rozklady.lodz.pl';
const http = Object.create(Http);
const noop = () => { };

let hasCookie = false;

const fetchCookie = () => {
    if (hasCookie) {
        return Promise.resolve();
    } else {
        return http.head(apiUrlBase)
            .tap(() => hasCookie = true);
    }
};

const fetchStopsData = () => fetchCookie()
    .then(() => http.post(`${apiUrlBase}/Home/GetMapBusStopList`))
    .then((response) => response.responseText);

const fetchTimetablesByStopsIds = (stopIds, updateCallback = noop) => {
    let completedStepsCount = 0;
    const totalStepsCount = stopIds + 1; // +1 because of fetchCookie
    const promises = stopIds.map((stopId) => {
        return http.get(`${apiUrlBase}/Home/GetTimetableReal?busStopId=${stopId}`)
            .tap(() => updateCallback(++completedStepsCount / totalStepsCount));
    });

    return fetchCookie()
        .tap(() => updateCallback(++completedStepsCount / totalStepsCount))
        .then(() => Promise.all(promises))
        .then((responses) => responses.map((r) => r.responseText));
};

export const Api = {
    fetchStopsData,
    fetchTimetablesByStopsIds
};