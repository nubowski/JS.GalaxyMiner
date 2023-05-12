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
    buildings: buildings
};

// Pass gameState to producers
for (let producer of producers) {
    producer.setGameState(gameState);
}

// Pass gameState to buildingQueue
buildingQueue.setGameState(gameState);

export default gameState;