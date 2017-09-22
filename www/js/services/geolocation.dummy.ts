import { Geolocation } from './geolocation';

export class DummyGeolocation extends Geolocation {
    static getCurrentPosition(): Promise<Position> {
        const position: Position = {
            coords: {
                accuracy: 0,
                altitude: 0,
                altitudeAccuracy: 0,
                heading: 0,
                latitude: 51.759248,
                longitude: 19.455983,
                speed: 0
            },
            timestamp: new Date().getTime()
        };
        
        return new Promise((resolve) => {
            setTimeout(() => resolve(position), 200);
        });
    }
}