import {MAX_LOG_ENTRIES} from "./constants.js";

class GameLog {
    constructor(maxEntries = MAX_LOG_ENTRIES) {
        this.maxEntries = maxEntries;
        this.logElement = document.getElementById('game-log');
    }

    addToLog(message) {
        let newLogEntry = document.createElement('p');
        newLogEntry.textContent = message;
        this.logElement.appendChild(newLogEntry);

        // threshold MAX_LOG_ENTRIES is out
        while (this.logElement.childElementCount > this.maxEntries) {
            // remove oldest create newest?
            this.logElement.removeChild(this.logElement.firstChild);
        }
    }
}

export default GameLog;