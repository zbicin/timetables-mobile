import GoogleMapsLoader from 'google-maps';

import { StopMarker } from './stopMarker';
import { MapDimensions, StopDepartures } from '../../interfaces/index';

export class Map {
    private element: HTMLElement;
    private map: google.maps.Map;
    private markers: StopMarker[];

    static init(): Promise<Map> {
        return new Promise((resolve, reject) => {
            const element = document.querySelector('.map') as HTMLElement;

            GoogleMapsLoader.KEY = 'AIzaSyBYQfyw_W9Ts-5E3bUYV7-B5NmByt_t2dU';
            GoogleMapsLoader.load((google) => {

                resolve(new Map(element, google));
            });
        });
    }

    constructor(element: HTMLElement, google: any) {
        this.element = element;

        const center = {lat: 51.759248, lng: 19.455983};
        this.map = new google.maps.Map(this.element, {
            zoom: 18,
            center: center
        });
        const dimensions = this.calculateDimensions();
        const stop: StopDepartures = {
            currentTime: 'tera',
            departures: [
                {
                    direction: 'TELEFONICZNA',
                    number: 'oN7A',
                    time: '<1 min'
                },
                {
                    direction: '10 DO ZAJEZDNI TELEFONICZNA',
                    number: '10',
                    time: '10 min'
                },
                {
                    direction: 'DW. ŁÓDŹ CHOJNY',
                    number: '1',
                    time: '22:48'
                }
            ],
            id: 'id',
            name: 'Przystanek testowy'
        };
        this.markers = [
            new StopMarker(stop, dimensions, this.map, google)
        ];
    }

    private calculateDimensions(): MapDimensions {
        const referenceWidth = 1080;
        const referenceHeight = 1920;
        const widthRatio = document.body.clientWidth / referenceWidth;
        const heightRatio = document.body.clientHeight / referenceHeight;
        const ratio = Math.min(widthRatio, heightRatio);
        const fontSize = Math.round(25 * ratio);
        const boldFontStyle = `bold ${fontSize}px sans-serif`;
        const normalFontStyle = `normal ${fontSize}px sans-serif`;
        
        const numberWidth = Math.round(this.measureText(boldFontStyle, 'oN7A'));
        const timeWidth = Math.round(this.measureText(normalFontStyle, '<1 min'));
        
        const boxHeight = Math.round((3 * fontSize) + 4);
        const boxWidth = numberWidth + timeWidth + 10;
        
        const numberRight = numberWidth + 2;
        const timeRight = boxWidth - 2;
        const lineTop = [0, 1, 2].map((i) => 1 + (i * fontSize));

        return { boldFontStyle, boxHeight, boxWidth, fontSize, lineTop, normalFontStyle, numberRight, numberWidth, timeRight, timeWidth };
    }

    private measureText(fontStyle: string, text: string): number {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        
        const context = canvas.getContext('2d');
        context.font = fontStyle;
        
        const result = context.measureText(text).width;
        return result;
    }
}