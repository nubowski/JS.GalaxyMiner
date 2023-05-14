import eventBus from './eventBus/EventBus.js';
import GameLog from './modules/GameLog.js';
import TimerManager from './modules/TimerManager.js';
import resourceData from './data/resourceData.js';
import buildingData from './data/buildingData.js';
import createBuilding from './utils/buildingFactory.js';
import BuildingManager from './modules/BuildingManager.js';
import UIManager from './modules/UIManager.js';
import UserInputManager from './modules/UserInputManager.js';

// Init Instances
let buildingTemplates = Object.values(buildingData);
let resourceInstances = Object.values(resourceData);

let timerManager = new TimerManager();
let uiManager = new UIManager(buildingTemplates);
let userInputManager = new UserInputManager(buildingTemplates);

// Convert building data into instances of the Building or Producer class
let buildingManager = new BuildingManager(buildingTemplates, resourceInstances);

eventBus.emit('createBuildButtons');
eventBus.emit('onClickListener', buildingTemplates);


// DOM-related interactions
document.addEventListener('DOMContentLoaded', () => {
    // Inits after DOM

    // Init Game Log
    let gameLog = new GameLog();
    eventBus.on('log', (data) => gameLog.addToLog(data.message, data.messageType));

    // Start Timer
    timerManager.start();

    // Update the UI with the initial state of the game
    uiManager.updateDisplay(resourceInstances, buildingManager);
});
