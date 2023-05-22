import eventBus from "../eventBus/EventBus.js";

class TimerManager {
    constructor(tickInterval = 1000) { // default to 1 second intervals
        this.tickInterval = tickInterval;
        this.intervalID = null;

        eventBus.on('StartContinueGame', this.start.bind(this));
    }

    start () {
        if (this.intervalID === null) {
            this.intervalID = setInterval(() => {
                console.log("Timer Tick");
                eventBus.emit('timerTick');
            }, this.tickInterval);
        }
    }

    stop () {
        if (this.intervalID !== null) {
            clearInterval(this.intervalID);
            this.intervalID = null;
        }
    }
}

export default TimerManager;