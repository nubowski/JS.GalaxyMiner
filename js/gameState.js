import Resource from './classes/resource.js';
import Producer from "./classes/producer.js";
import GameLog from "./classes/gameLog.js";
import Building from "./classes/building.js";
import BuildingManager from './classes/buildingManager.js';
import BuildingQueue from "./classes/buildingQueue.js";
import UImanager from "./classes/UImanager.js";

// Inits
let uiManager = new UImanager();
let gameLog = new GameLog();
let buildingManager = new BuildingManager();
let buildingQueue = new BuildingQueue();
let areButtonsGenerated = false;

// Init resources
let metal = new Resource('Metal', 1000);
let carbon = new Resource('Carbon', 1000);

// Init producers (name, space, level, constructionTime, resourceType, productionRate, cost)
let metalDrill = new Producer('Metal Drill', 2, 1, 10000, metal, 1, [
    {resource: metal, baseCost: 10}
]);
let carbonExtractor = new Producer('Carbon Extractor', 2, 1, 5000, carbon, 1,[
    {resource: metal, baseCost: 30},
    {resource: carbon, baseCost: 50}
]);

// Array to hold all producers
let resources = [metal,carbon];
let producers = [metalDrill,carbonExtractor];
let buildings = [];

// Game state
let gameState = {
    gameLog: gameLog,
    buildingManager: buildingManager,
    buildingQueue: buildingQueue,
    resources: resources,
    producers: producers,
    buildings: buildings,
    uiManager: uiManager,
};

// After the gameState object
setInterval(() => {
    // Check if there's a building in the queue
    if (buildingQueue.getQueueLength() > 0) {
        // Check if the building can be built
        if (buildingManager.canBuild(buildingQueue.getNextBuilding())) {
            // Add the building to the building manager
            buildingManager.startBuilding(buildingQueue.removeFromQueue());
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
        gameState.uiManager.generateBuildButtons(producers, buildingManager);
        areButtonsGenerated = true;
    }
}, 1000);

// Pass gameState to producers
for (let producer of producers) {
    producer.setGameState(gameState);
}

// Pass gameState to buildingQueue
buildingQueue.setGameState(gameState);

export default gameState;