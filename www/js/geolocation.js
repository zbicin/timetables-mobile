import { Promise } from 'bluebird';

const getCurrentPosition = () => new Promise((resolve, reject) => {
    const timeout = 10000;
    //navigator.geolocation.getCurrentPosition(resolve, reject, { timeout });
    resolve({
        coords: {
            latitude: 0,
            longitude: 0
        }
    })
});

export const Geolocation = {
    getCurrentPosition
};