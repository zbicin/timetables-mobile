import { Departure } from './departure';

export interface StopDepartures {
    currentTime: string;
    departures: Array<Departure>;
    id: string;
    name: string;
}