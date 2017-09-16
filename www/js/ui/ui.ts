import { CardList } from './card/index';
import { DebugConsole } from './debugConsole';
import { DOMHelper } from './dom';
import { Splash } from './splash/index';

export enum Events {
    DevicePause,
    DeviceReady,
    DeviceResume,
    InfoClick,
    RefreshClick,
    RetryClick
}

const cordova = (window as any).cordova;

export class UI {
    public cardList: CardList;
    public debugConsole: DebugConsole;
    public splash: Splash;
    
    private eventHandlers: Object;

    private menuInfoElement: HTMLElement;
    private menuRefreshElement: HTMLElement;
    private menuTitle: HTMLElement;


    constructor() {
        this.eventHandlers = {};

        this.menuInfoElement = DOMHelper.$('#menu-info');
        this.menuInfoElement.addEventListener('click', (e) => this.dispatchEvent(Events.InfoClick));

        this.menuRefreshElement = DOMHelper.$('#menu-refresh');
        this.menuRefreshElement.addEventListener('click', (e) => this.dispatchEvent(Events.RefreshClick));

        this.menuTitle = DOMHelper.$('#menu-title');

        this.cardList = new CardList();
        this.debugConsole = new DebugConsole();
        this.splash = new Splash(this.debugConsole);
        this.splash.retryButton.addEventListener('click', (e) => this.dispatchEvent(Events.RetryClick, e));

        document.addEventListener('pause', (e) => this.dispatchEvent(Events.DevicePause, e));
        document.addEventListener('ready', (e) => this.dispatchEvent(Events.DeviceReady, e));
        document.addEventListener('resume', (e) => this.dispatchEvent(Events.DeviceResume, e));
        document.addEventListener('konamiCode', () => this.onKonamiCode());
        document.addEventListener('deviceready', (e) => {
            if (cordova.platformId === 'android') {
                StatusBar.backgroundColorByHexString('ee8801');
            }

            this.dispatchEvent(Events.DeviceReady, e);
            this.debugConsole.updateVisibility();
        });
    }

    public handleErrorMessage(e: any): void {
        let errorMessage;
        let information;

        if (e instanceof XMLHttpRequest) {
            errorMessage = e.statusText || e.status;
            information = `Wystąpił problem z połączeniem internetowym. Sprawdź ustawienia telefonu i spróbuj ponownie (${errorMessage}).`;
        } else if (e.toString().indexOf('PositionError') > -1) {
            errorMessage = e.code;
            information = `Nie udało się ustalić Twojego położenia. Sprawdź ustawienia lokalizacji w swoim urządzeniu i spróbuj ponownie (kod błędu: ${errorMessage}).`;
        } else {
            errorMessage = e.message || e.code || e;
            information = `Nie udało się pobrać danych przystanków w okolicy. Upewnij się, że masz włączone usługi lokalizacji oraz dostęp do Internetu, a następnie uruchom ponownie aplikację. (${errorMessage})`;
        }
        navigator.notification.alert(information, null, '¯\\_(ツ)_/¯');
        console.error(e);
        this.debugConsole.log(errorMessage);

        if (this.splash) {
            this.splash.showRetryButton();
        }
        if (this.menuRefreshElement) {
            this.menuRefreshElement.classList.remove('animate');
        }
    }

    public on(name: Events, callback: Function): void {
        this.eventHandlers[name] = callback;
    }

    public showInfoModal(lastRefreshTime: Date, refreshIntervalInSeconds: number): void {
        let version;

        cordova.getAppVersion()
            .catch(() => version = 'N/A')
            .then((v) => {
                version = version || v;
                let information = `Aplikacja wyświetla na żywo tablice rozkładowe przystanków znajdujących się w okolicy. Pobiera informacje z serwisu rozklady.lodz.pl i przedstawia je w wygodnej formie.\n\nDane odświeżane są automatycznie co ${refreshIntervalInSeconds} sekund.`;
                if (lastRefreshTime) {
                    information += ` Ostatnia aktualizacja danych: ${this.formatTime(lastRefreshTime)}.`;
                }
                information += `\n\nWersja aplikacji: ${version}\n`;
                information += 'Kontakt: tabliceprzystankowe@gmail.com\n\nAutorem ikony "Bus" udostępnionej na bazie licencji CC 3.0 BY US jest Nikita Kozin.\nhttps://creativecommons.org/licenses/by/3.0/us/';

                navigator.notification.alert(information, null, 'Tablice Przystankowe');
            });
    }

    public showRefreshButton(): void {
        this.menuRefreshElement.classList.remove('hidden');
    }

    public showTitle(): void {
        this.menuTitle.classList.remove('hidden');
    }

    public updateProgress(progress: number): void {
        this.debugConsole.log(progress);
        this.splash.progressBar.update(progress);
    }

    public updateRefreshState(lastRefreshTime: Date, isPending: boolean): void {
        if (lastRefreshTime && isPending) {
            this.menuRefreshElement.classList.add('animate');
        }
        else {
            this.menuRefreshElement.classList.remove('animate');
        }
    }

    private createEvent(name: string, data: any): CustomEvent {
        return new CustomEvent(name, { detail: data });
    }

    private dispatchEvent(name: Events, data?: any): void {
        if (this.eventHandlers[name]) {
            this.eventHandlers[name](data);
        }
    }

    private formatTime(date: Date): string {
        const twoDigits = (input) => input < 10 ? '0' + input : '' + input;
        return [date.getHours(), date.getMinutes(), date.getSeconds()]
            .map((segment) => segment < 10 ? '0' + segment : '' + segment)
            .join(':');
    }

    private onKonamiCode(): void {
        this.debugConsole.toggleVisibilityStatus();
        this.debugConsole.updateVisibility();
    }
}