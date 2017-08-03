import { Promise } from 'bluebird';

export class Geolocation {
    static getCurrentPosition() {
        return new Promise((resolve, reject) => {
            const timeout = 10000;
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout });
        });
    }
};