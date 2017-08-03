const cacheLifespanMs = 7 * 24 * 60 * 60 * 1000;
const fetchTimestampKey = 'stopsFetchTimestamp';
const rawDataKey = 'stopsRawData';


export class Stop {
    constructor(api) {
        this.api = api;
    }
    
    get _stopsData() {
        return localStorage.getItem(rawDataKey);
    }

    set _stopsData(rawStopsData) {
        localStorage.setItem(rawDataKey, rawStopsData);
    }

    get _lastFetchTimestamp() {
        return parseInt(localStorage.getItem(fetchTimestampKey), 10);
    }

    set _lastFetchTimestamp(timestamp) {
        localStorage.setItem(fetchTimestampKey, timestamp);
    }

    getNearest(latitude, longitude, limit) {
        return this._fetchOrRestoreStopsData()
            .then((rawStopsData) => {
                const vectorStopsData = JSON.parse(rawStopsData);
                const stopsDistance = vectorStopsData
                    .map((v) => this._parseStops(v, latitude, longitude))
                    .sort((a, b) => a.distance - b.distance);

                return stopsDistance.slice(0, limit);
            });
    }

    _deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    _fetchOrRestoreStopsData() {
        const now = +new Date();

        let fetchPromise;
        if (this._lastFetchTimestamp && now - this._lastFetchTimestamp < cacheLifespanMs) {
            fetchPromise = Promise.resolve(this._stopsData);
        } else {
            fetchPromise = this.api.fetchStopsData()
                .tap((rawStopsData) => {
                    this._lastFetchTimestamp = now;
                    this._stopsData = rawStopsData;
                });
        }

        return fetchPromise;
    }

    _getDistanceInMeters(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = this._deg2rad(lat2 - lat1);
        const dLon = this._deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this._deg2rad(lat1)) * Math.cos(this._deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c * 1000; // Distance in m
        return d;
    }

    _parseStops(vectorStop, latitude, longitude) {
        const stop = {
            id: vectorStop[0],
            name: vectorStop[1],
            latitude: vectorStop[5],
            longitude: vectorStop[4]
        };

        return {
            id: stop.id,
            name: stop.name,
            distance: this._getDistanceInMeters(latitude, longitude, stop.latitude, stop.longitude).toFixed(2)
        };
    }
}