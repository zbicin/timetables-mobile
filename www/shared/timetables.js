const http = Object.create(Http);
const geolocation = Object.create(Geolocation);

const FETCH_UPDATE_EVENT = 'fetch.update';
const FETCH_UPDATE_STATUS = {
    INITIALIZING: 0,
    LOCATION: 1,
    NEARBY_STOPS: 2,
    TIMETABLES: 3,
    FINISHED: 4
};

const notifyUpdate = (data = null) => {
    const event = new CustomEvent(FETCH_UPDATE_EVENT, {
        detail: data
    });
    document.dispatchEvent(event);
}

const fetchCookie = () => http.head('http://rozklady.lodz.pl');

const getNearbyStopsIds = (latitude, longitude) => {
    const url = `http://tablice-zbicin.rhcloud.com/api/getNearestStops?latitude=${latitude}&longitude=${longitude}`;
    return http.get(url).then((response) => {
        const stops = JSON.parse(response.responseText);
        const stopsIds = stops.map((stop) => stop.id);
        return Promise.resolve(stopsIds);
    });
};

const parseXmlDepartures = (rawXml) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawXml, 'application/xml');
    const result = {
        currentTime: doc.firstElementChild.attributes.time.value,
        departures: [],
        stopName: doc.getElementsByTagName('Stop')[0].attributes['name'].value
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

const fetchNearbyTimetables = () => {
    notifyUpdate(FETCH_UPDATE_STATUS.INITIALIZING);
    return fetchCookie()
        .then(() => {
            notifyUpdate(FETCH_UPDATE_STATUS.LOCATION);
            return geolocation.getCurrentPosition();
        })
        .then((position) => {
            notifyUpdate(FETCH_UPDATE_STATUS.NEARBY_STOPS);
            return getNearbyStopsIds(position.coords.latitude, position.coords.longitude)
        })
        .then((stopsIds) => {
            notifyUpdate(FETCH_UPDATE_STATUS.TIMETABLES);
            return fetchTimetablesByStopsIds(stopsIds);
        }).then((timetables) => {
            notifyUpdate(FETCH_UPDATE_STATUS.FINISHED);
            return Promise.resolve(timetables);
        });

}

const Timetables = {
    FETCH_UPDATE_EVENT,
    FETCH_UPDATE_STATUS,
    fetchNearbyTimetables
};