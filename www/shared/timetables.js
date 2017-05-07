const http = Object.create(Http);
const geolocation = Object.create(Geolocation);

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

const fetchNearbyTimetables = () => fetchCookie()
        .then(() => geolocation.getCurrentPosition())
        .then((position) => getNearbyStopsIds(position.coords.latitude, position.coords.longitude))
        .then((stopsIds) => fetchTimetablesByStopsIds(stopsIds));

const Timetables = {
    fetchNearbyTimetables
};