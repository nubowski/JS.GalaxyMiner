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

// Game Loop
setInterval(update, 1000);

// Update function
function update() {
    // Each producer produces
    for (let producer of producers) {
        producer.produce();
    }

    // Update the UI
    updateUI();
}

function updateUI() {
    // Get containers
    let resourceContainer = document.getElementById('resources-container');
    let productionContainer = document.getElementById('production-container');

    // Clear containers
    resourceContainer.innerHTML = '';
    productionContainer.innerHTML = '';

    // Add current state of resources to container
    for (let resource of resources) {
        resourceContainer.innerHTML += `<p>${resource.name}: ${resource.quantity.toFixed(2)}</p>`;
    }

    // Add current state of producers to container
    for (let producer of producers) {
        let costString = '';
        for (let resourceObj of producer.cost) {
            costString += `${resourceObj.amount.toFixed(2)} ${resourceObj.resource.name}, `;
        }
        costString = costString.slice(0, -2);  // Remove trailing comma and space

        productionContainer.innerHTML += `
            <p>
                ${producer.name} (Level ${producer.level}): Produces ${producer.productionRate.toFixed(2)} 
                ${producer.resourceType.name} per second. Cost for next upgrade: 
                ${costString}
            </p>
            <button id="${producer.name}-upgrade">Upgrade ${producer.name}</button>
        `;
    }

    // Event listeners for clicks on buttons
    for (let producer of producers) {
        document.getElementById(`${producer.name}-upgrade`).addEventListener('click', () => {
            if (!buildingQueue.addToQueue(producer)) {
                gameLog.negative("Building queue is full!");
            }
            producer.upgrade();
        })
    }
}