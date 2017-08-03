import { CardList } from './card/cardList';
import { DebugConsole } from './debugConsole';
import { DOMHelper } from './dom';
import { Splash } from './splash/splash';

export const Events = {
    DevicePause: 0,
    DeviceReady: 1,
    DeviceResume: 2,
    InfoClick: 3,
    RefreshClick: 4,
    RetryClick: 5
};

export class UI {
    constructor() {
        this.eventHandlers = {};

        this.menuInfoElement = DOMHelper.$('#menu-info');
        this.menuInfoElement.addEventListener('click', (e) => this._dispatchEvent(Events.InfoClick));

        this.menuRefreshElement = DOMHelper.$('#menu-refresh');
        this.menuRefreshElement.addEventListener('click', (e) => this._dispatchEvent(Events.RefreshClick));

        this.cardList = new CardList();
        this.debugConsole = new DebugConsole();
        this.splash = new Splash(this.debugConsole);
        this.splash.retryButton.addEventListener('click', (e) => this._dispatchEvent(Events.RetryClick, e));

        document.addEventListener('pause', (e) => this._dispatchEvent(Events.DevicePause, e));
        document.addEventListener('ready', (e) => this._dispatchEvent(Events.DeviceReady, e));
        document.addEventListener('resume', (e) => this._dispatchEvent(Events.DeviceResume, e));
        document.addEventListener('konamiCode', () => this._onKonamiCode());
        document.addEventListener('deviceready', (e) => {
            if (cordova.platformId == 'android') {
                StatusBar.backgroundColorByHexString('ee8801');
            }

            this._dispatchEvent(Events.DeviceReady, e);
            this.debugConsole.updateVisibility();
        });
    }

    handleErrorMessage(e) {
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

    on(name, callback) {
        this.eventHandlers[name] = callback;
    }

    showInfoModal(lastRefreshTime, refreshIntervalInSeconds) {
        let version;

        cordova.getAppVersion()
            .catch(() => version = 'N/A')
            .then((v) => {
                version = version || v;
                let information = `Aplikacja wyświetla na żywo tablice rozkładowe przystanków znajdujących się w okolicy. Pobiera informacje z serwisu rozklady.lodz.pl i przedstawia je w wygodnej formie.\n\nDane odświeżane są automatycznie co ${refreshIntervalInSeconds} sekund.`;
                if (lastRefreshTime) {
                    information += ` Ostatnia aktualizacja danych: ${this._formatTime(lastRefreshTime)}.`;
                }
                information += `\n\nWersja aplikacji: ${version}\n`;
                information += 'Kontakt: tabliceprzystankowe@gmail.com\n\nAutorem ikony "Bus" udostępnionej na bazie licencji CC 3.0 BY US jest Nikita Kozin.\nhttps://creativecommons.org/licenses/by/3.0/us/';

                navigator.notification.alert(information, null, 'Tablice Przystankowe');
            });
    }

    updateProgress(progress) {
        this.debugConsole.log(progress);
        this.splash.progressBar.update(progress);
    }

    updateRefreshState(lastRefreshTime, isPending) {
        if (lastRefreshTime && isPending) {
            this.menuRefreshElement.classList.add('animate');
        }
        else {
            this.menuRefreshElement.classList.remove('animate');
        }
    };

    _createEvent(name, data) {
        return new CustomEvent(name, { details: data });
    }

    _dispatchEvent(name, data) {
        if (this.eventHandlers[name]) {
            this.eventHandlers[name](data);
        }
    }

    _formatTime(date) {
        const twoDigits = (input) => input < 10 ? '0' + input : '' + input;
        return [date.getHours(), date.getMinutes(), date.getSeconds()]
            .map((segment) => segment < 10 ? '0' + segment : '' + segment)
            .join(':');
    }

    _onKonamiCode() {
        this.debugConsole.toggleVisibilityStatus();
        this.debugConsole.updateVisibility();
    }
}