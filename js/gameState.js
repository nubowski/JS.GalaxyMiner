import Resource from './classes/resource.js';
import GameLog from "./classes/gameLog.js";
import TimerManager from "./classes/timerManager.js";
import BuildingManager from './classes/buildingManager.js';
import BuildingQueue from "./classes/buildingQueue.js";
import UImanager from "./classes/UImanager.js";
import buildingData from "./classes/buildingData.js";

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
        // Check if there's a building in the queue
        if (buildingQueue.getQueueLength() > 0) {
            // Check if the building can be built
            if (buildingManager.canBuild(buildingQueue.getNextBuilding())) {
                // DO NOTHING, let buildingQueue handle the construction
            }
        }
        // Update the producers
        for (let producer of producers) {
            producer.produce();
        }
        // Update the display
        gameState.uiManager.updateDisplay(resources, buildingManager);
        gameState.uiManager.updateBuildingDisplay(buildingManager.getBuiltBuildings());

        // Generate build buttons
        if (!areButtonsGenerated) {
            gameState.uiManager.generateBuildButtons(buildingData, buildingManager);
            areButtonsGenerated = true;
        }
    }
});

timerManager.start();  // Start the TimerManager

// Pass gameState
buildingManager.setGameState(gameState);
buildingQueue.setGameState(gameState);

export default gameState;