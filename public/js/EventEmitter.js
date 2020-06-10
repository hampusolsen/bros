export default class EventEmitter {
    constructor() {
        this.listeners = [];
    }

    emit(name, ...args) {
        this.listeners.forEach(listener => {
            if (listener.name === name) {
                listener.callback(...args);
            }
        });
    }

    listen(name, callback) {
        const listener = { name, callback };
        this.listeners.push(listener);
    }
}