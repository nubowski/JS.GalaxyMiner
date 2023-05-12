class TimerManager {
    constructor(interval = 1000) {
        this.interval = interval;
        this.timers = [];
    }

    register(obj) {
        this.timers.push(obj);
    }

    start() {
        setInterval(() => {
            this.timers.forEach(timer => {
                if (typeof timer.onTimer === 'function') {
                    timer.onTimer();
                }
            });
        }, this.interval);
    }
}

export default TimerManager;