import { App } from '../js/app';
import { DummyUI, Events } from '../js/ui/ui.dummy';
describe('app', function() {
    describe('initialize', function() {
        it('should bind deviceready', function() {
            let app;
            runs(function() {
                app = new App(DummyUI);
                spyOn(app, '_onDeviceReady');
                app.ui.trigger(Events.DeviceReady);
            });

            waitsFor(function() {
                return (app._onDeviceReady.calls.length > 0);
            }, 'onDeviceReady should be called once', 500);

            runs(function() {
                expect(app._onDeviceReady).toHaveBeenCalled();
            });
        });
    });
});
