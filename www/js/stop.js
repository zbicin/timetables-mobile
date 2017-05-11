import stopsData from './stopsData.json';

const deg2rad = (deg) => {
    return deg * (Math.PI / 180)
}

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
}

const getNearest = (latitude, longitude, limit) => {
    const stopsDistance = stopsData.map((stop) => {
        return {
            id: stop.id,
            name: stop.name,
            distance: getDistanceInMeters(latitude, longitude, stop.latitude, stop.longitude).toFixed(2)
        }
    }).sort((a, b) => a.distance - b.distance);
    
    return stopsDistance.slice(0, limit);
}

export const Stop = {
    getNearest
}