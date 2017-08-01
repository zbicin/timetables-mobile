import { Promise } from 'bluebird';

const formatTime = (date) => date.toISOString().split('T')[1].substr(0, 5);

const generateDummyBoard = (index) => {
    const now = new Date();
    const formattedNow = formatTime(now);

    const departures = [];
    const departuresCount = 10;

    for(let i = 0; i<departuresCount; i++) {
        const departure = {
            direction: `Direction #${index}`,
            number: index.toString(),
            time: `${i+1} min`
        };

        departures.push(departure);
    }

    return {
        currentTime: formattedNow,
        stopId: index.toString(),
        stopName: `Dummy stop #${index}`,
        departures: departures
    };
};

const fetchNearbyTimetables = (limit = 10) => {
    const result = [];

    for(let i = 0; i<limit; i++) {
        const dummyBoard = generateDummyBoard(i);
        result.push(dummyBoard);
    }

    return new Promise((resolve) => setTimeout(() => resolve(result), 500));
};

export const DummyTimetables = {
    fetchNearbyTimetables
};