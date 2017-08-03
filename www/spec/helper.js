export class Helper {
    static clearStage() {
        document.getElementById('stage').innerHTML = '';
    }

    static trigger(obj, name) {
        var e = document.createEvent('Event');
        e.initEvent(name, true, true);
        obj.dispatchEvent(e);
    }

    getComputedStyle(querySelector, property) {
        var element = document.querySelector(querySelector);
        return window.getComputedStyle(element).getPropertyValue(property);
    }
};