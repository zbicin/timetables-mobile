import { Api } from '../api/index';
import { StopPosition, VectorStop } from '../interfaces/index';

const cacheLifespanMs = 7 * 24 * 60 * 60 * 1000;
const fetchTimestampKey = 'stopsFetchTimestamp';
const rawDataKey = 'stopsRawData';

export class Stop {
    private api: Api;

    constructor(api: Api) {
        this.api = api;
    }

    public getNearest(latitude: number, longitude: number, limit: number): Promise<StopPosition[]> {
        return this.fetchOrRestoreStopsData()
            .then((rawStopsData: string) => {
                const vectorStopsData = JSON.parse(rawStopsData) as VectorStop[];
                const stopsDistance = vectorStopsData
                    .map((v) => this.parseStopPosition(v, latitude, longitude))
                    .sort((a, b) => a.distance - b.distance);

                return stopsDistance.slice(0, limit);
            });
    }

    private get stopsData(): string {
        return localStorage.getItem(rawDataKey);
    }

    private set stopsData(rawStopsData: string) {
        localStorage.setItem(rawDataKey, rawStopsData);
    }

    private get lastFetchTimestamp(): number {
        return parseInt(localStorage.getItem(fetchTimestampKey), 10);
    }

    private set lastFetchTimestamp(timestamp: number) {
        localStorage.setItem(fetchTimestampKey, timestamp.toString());
    }

    private deg2rad(deg: number): number {
        return deg * (Math.PI / 180)
    }

    private fetchOrRestoreStopsData(): Promise<string> {
        const now = +new Date();

        let fetchPromise;
        if (this.lastFetchTimestamp && now - this.lastFetchTimestamp < cacheLifespanMs) {
            fetchPromise = Promise.resolve(this.stopsData);
        } else {
            fetchPromise = this.api.fetchStopsData()
                .then((rawStopsData) => {
                    this.lastFetchTimestamp = now;
                    this.stopsData = rawStopsData;
                    return rawStopsData;
                });
        }

        return fetchPromise;
    }

    private getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371; // Radius of the earth in km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c * 1000; // Distance in m
        return d;
    }

    private parseStopPosition(vectorStop: VectorStop, latitude: number, longitude: number): StopPosition {
        const stopId = vectorStop[0];
        const stopName = vectorStop[1];
        const stopLatitude = vectorStop[5];
        const stopLongitude = vectorStop[4];
        const stopDistance = this.getDistanceInMeters(latitude, longitude, stopLatitude, stopLongitude);

        return {
            distance: this.roundToPrecision(stopDistance, 2),
            id: stopId,
            latitude: latitude,
            longiture: longitude,
            name: stopName,
        };
    }

    private roundToPrecision(input: number, precision: number): number {
        const multiplier = Math.pow(10, precision);
        return Math.round(input * multiplier) / multiplier;
    }
}

