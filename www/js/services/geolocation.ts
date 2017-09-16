export class Geolocation {
    static getCurrentPosition(): Promise<Position> {
        return new Promise((resolve, reject) => {
            const enableHighAccuracy = true;
            const timeout = 10000;
            navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy, timeout });
        });
    }
};