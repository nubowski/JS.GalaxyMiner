import ResourceManager from "./modules/ResourceManager.js";
import eventBus from './eventBus/EventBus.js';
import TimerManager from './modules/TimerManager.js';
import GameLog from './modules/GameLog.js';
import buildingData from './data/buildingData.js';
import BuildingManager from './modules/BuildingManager.js';
import UIManager from './modules/UIManager.js';
import UserInputManager from './modules/UserInputManager.js';
import GameStateManager from "./modules/GameStateManager.js";
import SaveManager from "./modules/SaveManager.js";

// Init Instances
let buildingTemplates = Object.values(buildingData);
let resourceManager = new ResourceManager();  // ResourceManager will initialize the resources

let timerManager = new TimerManager();
let saveManager = new SaveManager();
let uiManager = new UIManager(buildingTemplates);
let userInputManager = new UserInputManager(buildingTemplates);

let buildingManager = new BuildingManager(buildingTemplates, resourceManager);
let gameStateManger = new GameStateManager(resourceManager, buildingManager);

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
    uiManager.updateDisplay(resourceManager.getResourceData(), buildingManager);  // Use ResourceManager's method

    eventBus.emit('LoadGame');

    eventBus.on('setGameState', (loadedState) => {
        if (loadedState === undefined) {
            console.log('Starting new game');
            // start new game
        } else {
            console.log('Continuing from saved game state');
            // use loadedState to continue from the saved game state
        }
    });
});
