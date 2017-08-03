import { App } from '../js/app';
import { DummyUI, Events } from '../js/ui/ui.dummy';
import { DummyTimetables } from '../js/services/timetables.dummy';

describe('app', function () {
    let app;

    beforeEach(() => {
        app = new App(DummyTimetables, DummyUI);
    });

    it('binds deviceready', function () {
        spyOn(app, '_onDeviceReady');
        app.ui.trigger(Events.DeviceReady);

        expect(app._onDeviceReady).toHaveBeenCalled();
    });

    it('sets new periodical refresh after resume', (done) => {
        let oldRefreshHandle = app.refreshHandle;
        spyOn(app, '_onDevicePause').and.callThrough();
        spyOn(app, '_onDeviceResume').and.callThrough();
        spyOn(app, '_setupRefreshInterval').and.callThrough();

        app.ui.trigger(Events.DevicePause);
        app.ui.trigger(Events.DeviceResume);

        setTimeout(() => {
            expect(app._onDevicePause).toHaveBeenCalled();
            expect(app._onDeviceResume).toHaveBeenCalled();
            expect(app._setupRefreshInterval).toHaveBeenCalled();
            expect(app.refreshHandle).not.toEqual(oldRefreshHandle);
            done();
        }, 100);
    });
});
