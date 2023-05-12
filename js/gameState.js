import Resource from './classes/resource.js';
import Producer from "./classes/producer.js";
import GameLog from "./classes/gameLog.js";
import BuildingManager from './classes/buildingManager.js';
import BuildingQueue from "./classes/buildingQueue.js";

// Inits
let gameLog = new GameLog();
let buildingManager = new BuildingManager();
let buildingQueue = new BuildingQueue();

// Init resources
let metal = new Resource('Metal', 0);
let carbon = new Resource('Carbon', 0);

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
    generateBuildButtons: function() {
        for (let producer of this.producers) {
            let button = document.createElement('button');
            button.innerHTML = `Build ${producer.name}`;
            button.onclick = () => producer.build(this.buildingManager);
            document.getElementById('buildButtons').appendChild(button);
        }
    }
};

// After the gameState object
setInterval(() => {
    // Check if there's a building in the queue
    if (buildingQueue.getQueueLength() > 0) {
        // Check if the building can be built
        if (buildingManager.canBuild(buildingQueue.getNextBuilding())) {
            // Add the building to the building manager
            buildingManager.addBuilding(buildingQueue.removeFromQueue());
        }
    }
    // Update the producers
    for (let producer of producers) {
        producer.produce();
    }
}, 1000);

// Pass gameState to producers
for (let producer of producers) {
    producer.setGameState(gameState);
}

// Pass gameState to buildingQueue
buildingQueue.setGameState(gameState);

// Generate build buttons
gameState.generateBuildButtons();

export default gameState;