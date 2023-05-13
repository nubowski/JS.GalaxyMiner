import eventBus from "../eventBus/EventBus.js";

class TimerManager {
    constructor(tickInterval = 1000) { // kill the magic number even if its means 1 second
        this.tickInterval = tickInterval;
        this.intervalID = null;
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