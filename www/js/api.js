import { Http } from './http';

import { Promise } from 'bluebird';

const apiUrlBase = 'http://rozklady.lodz.pl';
const http = Object.create(Http);

let hasCookie = false;

const fetchCookie = () => {
    if(hasCookie) {
        return Promise.resolve();
    } else {
        return http.head(apiUrlBase)
            .tap(() => hasCookie = true);
    }
};

const fetchStopsData = () => fetchCookie()
        .then(() => http.post(`${apiUrlBase}/Home/GetMapBusStopList`))
        .then((response) => response.responseText);

const fetchTimetablesByStopsIds = (stopIds) => {
    const promises = stopIds.map((stopId) => {
        return http.get(`${apiUrlBase}/Home/GetTimetableReal?busStopId=${stopId}`);
    });

    return fetchCookie()
        .then(() => Promise.all(promises))
        .then((responses) => responses.map((r) => r.responseText));
};

export const Api = {
    fetchStopsData,    
    fetchTimetablesByStopsIds
};