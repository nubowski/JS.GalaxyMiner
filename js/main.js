import eventBus from "./eventBus/EventBus.js";
import GameLog from "./modules/GameLog.js";
import TimerManager from "./modules/TimerManager.js";


// Init Instances
let timerManager = new TimerManager();

// DOM-related interactions
document.addEventListener('DOMContentLoaded', () => {
    // Inits after DOM

    // Init Game Log
    let gameLog = new GameLog();
    eventBus.on('log', (data) => gameLog.addToLog(data.message, data.messageType));

    // Start Timer
    timerManager.start();

})