export class Emitter {
    private eventHandlers: Object;
    
    constructor() {
        this.eventHandlers = {};        
    }

    public on(name: string, callback: Function): void {
        this.eventHandlers[name] = callback;
    }

    protected dispatchEvent(name: string, data?: any): void {
        if (this.eventHandlers[name]) {
            this.eventHandlers[name](data);
        }
    }
}    