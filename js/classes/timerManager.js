class TimerManager {
    constructor(tickInterval = 1000) {
        this.tickInterval = tickInterval;
        this.intervalId = null;
        this.callbacks = [];
    }

    start() {
        if (this.intervalId === null) {
            this.intervalId = setInterval(() => {
                console.log("Timer tick");
                for (let callback of this.callbacks) {
                    callback.onTimer();
                }
            }, this.tickInterval); // from 1000 to field
        }
    }

    register(callback) {
        this.callbacks.push(callback);
    }

    unregister(callback) {
        let index = this.callbacks.indexOf(callback);
        if (index > -1) {
            this.callbacks.splice(index, 1);
        }
    }
}

export default TimerManager;