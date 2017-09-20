import { MapDimensions, StopDepartures } from '../../interfaces/index';

export class StopMarker {
    private infoWindow: google.maps.InfoWindow;
    private marker: google.maps.Marker;

    constructor(stop: StopDepartures, dimensions: MapDimensions, map: google.maps.Map, google: any) {

        this.marker = new google.maps.Marker({
            icon: this.generateIcon(stop, dimensions),
            map: map,
            position: new google.maps.LatLng(51.759248, 19.455983)
        });

        this.marker.addListener('click', () => {
            this.infoWindow = new google.maps.InfoWindow({
                content: this.generateInfo(stop)
            });

            this.infoWindow.open(map, this.marker);
        });

    }

    private generateIcon(stop: StopDepartures, dimensions: MapDimensions): string {
        const canvas = document.createElement('canvas');
        canvas.width = dimensions.boxWidth;
        canvas.height = dimensions.boxHeight;

        const context = canvas.getContext('2d');
        
        context.fillStyle = 'white';
        context.fillRect(0, 0, dimensions.boxWidth, dimensions.boxHeight);
        context.strokeStyle = 'black';
        context.strokeRect(0, 0, dimensions.boxWidth, dimensions.boxHeight);

        context.textBaseline = 'top';
        context.fillStyle = 'black';
        context.textAlign = 'right';

        context.font = dimensions.boldFontStyle;
        stop.departures.forEach((departure, i) => {
            context.fillText(departure.number, dimensions.numberRight, dimensions.lineTop[i], dimensions.numberWidth);
        });
        
        context.font = dimensions.normalFontStyle;
        stop.departures.forEach((departure, i) => {
            context.fillText(departure.time, dimensions.timeRight, dimensions.lineTop[i], dimensions.timeWidth)
        });

        const result = canvas.toDataURL();
        return result;
    }

    private generateInfo(stop: StopDepartures): string {
        const result = `
            <table>
                <thead>                
                    <tr>
                        <th colspan="3">${stop.name}</th>
                    </tr>
                </thead>
                <tbody>
                    ${stop.departures.map((departure) => `
                            <tr>
                                <td>${departure.number}</td>
                                <td>${departure.direction}</td>
                                <td>${departure.time}</td>
                            </tr>
                        `).join('')}
                </tbody>
            </table>
        `;
        return result;
    }
}