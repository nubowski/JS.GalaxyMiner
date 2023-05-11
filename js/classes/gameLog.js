import {MAX_LOG_ENTRIES} from "./constants.js";

class GameLog {
    constructor(maxEntries = MAX_LOG_ENTRIES) {
        this.maxEntries = maxEntries;
        this.logEntries = [];
        this.logElement = document.getElementById('game-log');
    }

    error(message) {
        this.addToLog(message, "error");
    }

    info(message) {
        this.addToLog(message, "info");
    }

    debug(message) {
        this.addToLog(message, "debug");
    }

    positive(message) {
        this.addToLog(message, "positive");
    }

    negative(message) {
        this.addToLog(message, "negative");
    }

    addToLog(message, messageType) {
        if (this.logEntries.length >= this.maxEntries) {
            this.logEntries.pop(); // remove last element
        }
        this.logEntries.unshift({message, messageType}); // prepend
        this.updateLog();
    }

    updateLog() {
        this.logElement.innerHTML = '';
        for (let entry of this.logEntries) {
            this.logElement.innerHTML = `
                <p class="${entry.messageType}">${entry.message}</p>` + this.logElement.innerHTML;
        }
    }
}

export default GameLog;