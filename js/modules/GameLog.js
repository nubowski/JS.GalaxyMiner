import {MAX_LOG_ENTRIES} from "../data/constants.js";
import eventBus from "../eventBus/EventBus.js";

class GameLog {
    constructor(maxEntries = MAX_LOG_ENTRIES) {
        this.maxEntries = maxEntries;
        this.logEntries = [];
        this.logElement = document.getElementById('game-log');

        eventBus.on('log.error', message => this.error(message));
        eventBus.on('log.info', message => this.info(message));
        eventBus.on('log.debug', message => this.debug(message));
        eventBus.on('log.positive', message => this.positive(message));
        eventBus.on('log.negative', message => this.negative(message));
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
        // clear existing log HTML
        this.logElement.innerHTML = '';

        // loop through the log entries (reversed)
        for (let i = 0; i < this.logEntries.length; i++) {
            const entry = this.logEntries[i];

            // new p element
            const logEntryElement = document.createElement('p');
            logEntryElement.className = entry.messageType;
            logEntryElement.textContent = entry.message;

            // log entry to the log element
            this.logElement.appendChild(logEntryElement);
        }
    }
}

export default GameLog;