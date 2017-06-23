import { Api } from './api';

const api = Object.create(Api);

const cacheLifespanMs =  7 * 24 * 60 * 60 * 1000;
const stopsFetchTimestampKey = 'stopsFetchTimestamp';
const stopsRawDataKey = 'stopsRawData';

const deg2rad = (deg) => {
    return deg * (Math.PI / 180)
};

const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c * 1000; // Distance in m
    return d;
};

const parseStops = (vectorStop, latitude, longitude) => {
    const stop = {
        id: vectorStop[0],
        name: vectorStop[1],
        latitude: vectorStop[5],
        longitude: vectorStop[4]
    };

    return {
        id: stop.id,
        name: stop.name,
        distance: getDistanceInMeters(latitude, longitude, stop.latitude, stop.longitude).toFixed(2)
    };
};

const fetchOrRestoreStopsData = () => {
    const lastFetchTimestamp = parseInt(localStorage.getItem(stopsFetchTimestampKey), 10);
    const now = +new Date();
    let fetchPromise;
    if (lastFetchTimestamp && now - lastFetchTimestamp < cacheLifespanMs) {
        const rawStopsData = localStorage.getItem(stopsRawDataKey);
        fetchPromise = Promise.resolve(rawStopsData);
    } else {
        fetchPromise = api.fetchStopsData()
            .tap((rawStopsData) => {
                localStorage.setItem(stopsFetchTimestampKey, now);
                localStorage.setItem(stopsRawDataKey, rawStopsData);
            });
    }

    return fetchPromise;
};

const getNearest = (latitude, longitude, limit) => fetchOrRestoreStopsData()
    .then((rawStopsData) => {
        const vectorStopsData = JSON.parse(rawStopsData);
        const stopsDistance = vectorStopsData
            .map((v) => parseStops(v, latitude, longitude))
            .sort((a, b) => a.distance - b.distance);

        return stopsDistance.slice(0, limit);
    });

export const Stop = {
    getNearest
};