import Resource from './classes/resource.js';
import GameLog from "./classes/gameLog.js";
import Producer from "./classes/producer.js";
import TimerManager from "./classes/timerManager.js";
import BuildingManager from './classes/buildingManager.js';
import BuildingQueue from "./classes/buildingQueue.js";
import UImanager from "./classes/UImanager.js";
import buildingData from "./data/buildingData.js";

// Inits
let uiManager = new UImanager();
let gameLog = new GameLog();
let buildingManager = new BuildingManager();
let buildingQueue = new BuildingQueue();
let timerManager = new TimerManager();
let areButtonsGenerated = false;

// Init resources
let metal = new Resource('Metal', 1000);
let carbon = new Resource('Carbon', 1000);

// Array to hold all producers
let resources = [metal,carbon];
let buildings = []

// Game state
let gameState = {
    gameLog: gameLog,
    buildingManager: buildingManager,
    buildingQueue: buildingQueue,
    resources: resources,
    buildings: buildings,
    uiManager: uiManager,
    timerManager: timerManager,
};

timerManager.register({
    onTimer: function() {
        // Produce resources from each Producer
        for (let building of gameState.buildings) {
            if (building instanceof Producer) {
                building.produce();
            }
        }
        // Update the display
        gameState.uiManager.updateDisplay(resources, buildingManager);
        gameState.uiManager.updateBuildingDisplay(buildingManager.getBuiltBuildings());

        // Generate build buttons
        if (!areButtonsGenerated) {
            gameState.uiManager.generateBuildButtons(buildingData, buildingManager, gameState.buildingQueue, resources);
            areButtonsGenerated = true;
        }
    }
});

timerManager.start();  // Start the TimerManager

// Pass gameState
buildingManager.setGameState(gameState);
buildingQueue.setGameState(gameState);

export default gameState;