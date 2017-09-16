import { Http } from './http';

const apiUrlBase = 'http://rozklady.lodz.pl';
const noop = (arg: number) => { };

export class Api {
    private hasCookie: boolean;
    private http: Http;

    constructor() {
        this.hasCookie = false;
        this.http = new Http();
    }

    public fetchStopsData(): Promise<string> {
        return this.fetchCookie()
            .then(() => this.http.post(`${apiUrlBase}/Home/GetMapBusStopList`))
            .then((response: XMLHttpRequest) => response.responseText);
    }

    public fetchTimetablesByStopsIds(stopIds: number[], updateCallback = noop) {
        let completedStepsCount = 0;
        const totalStepsCount = stopIds.length + 1; // +1 because of fetchCookie
        const promises: Promise<XMLHttpRequest>[] = stopIds.map((stopId: number) => {
            return this.http.get(`${apiUrlBase}/Home/GetTimetableReal?busStopId=${stopId}`)
            .then((response) => {
                updateCallback(++completedStepsCount / totalStepsCount);
                return response;
            });
        });

        return this.fetchCookie()
            .then(() => updateCallback(++completedStepsCount / totalStepsCount))
            .then(() => Promise.all(promises))
            .then((responses: XMLHttpRequest[]) => responses.map((r) => r.responseText));
    }

    private fetchCookie(): Promise<any> {
        if (this.hasCookie) {
            return Promise.resolve();
        } else {
            return this.http.head(apiUrlBase)
                .then((response) => {
                    this.hasCookie = true;
                    return response;
                });
        }
    };
};
