import { Http } from './http';
import { Promise } from 'bluebird';

const apiUrlBase = 'http://rozklady.lodz.pl';
const noop = () => { };

export class Api {
    constructor() {
        this.hasCookie = false;
        this.http = new Http();
    }

    fetchStopsData() {
        return this._fetchCookie()
            .then(() => this.http.post(`${apiUrlBase}/Home/GetMapBusStopList`))
            .then((response) => response.responseText);
    }

    fetchTimetablesByStopsIds(stopIds, updateCallback = noop) {
        let completedStepsCount = 0;
        const totalStepsCount = stopIds + 1; // +1 because of fetchCookie
        const promises = stopIds.map((stopId) => {
            return this.http.get(`${apiUrlBase}/Home/GetTimetableReal?busStopId=${stopId}`)
                .tap(() => updateCallback(++completedStepsCount / totalStepsCount));
        });

        return this._fetchCookie()
            .tap(() => updateCallback(++completedStepsCount / totalStepsCount))
            .then(() => Promise.all(promises))
            .then((responses) => responses.map((r) => r.responseText));
    }

    _fetchCookie() {
        if (this.hasCookie) {
            return Promise.resolve();
        } else {
            return this.http.head(apiUrlBase)
                .tap(() => this.hasCookie = true);
        }
    };
};
