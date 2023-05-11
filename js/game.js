import Resource from './classes/resource.js';
import ResourceProducer from "./classes/resourceProducer.js";
import GameLog from "./classes/gameLog.js";

// Init game log
let gameLog = new GameLog();

// Init resources
let metal = new Resource('Metal', 0);
let carbon = new Resource('Carbon', 0);

// Init producers
let metalDrill = new ResourceProducer('Metal Drill', metal, 1, [
    {resource: metal, baseCost: 10}
]);
let carbonExtractor = new ResourceProducer('Carbon Extractor', carbon, 1,[
    {resource: metal, baseCost: 30},
    {resource: carbon, baseCost: 50}
]);

// Array to hold all prods
let resources = [metal,carbon]
let producers = [metalDrill,carbonExtractor];

// Game Loop
setInterval(update, 1000);

// Update function
function update() {
    // Each produce on every prod
    for (let producer of producers) {
        producer.produce();
        }

    // Update the UI
    updateUI();
}

function updateUI() {
    // get containers
    let resourceContainer = document.getElementById('resources-container');
    let productionContainer = document.getElementById('production-container');

    // clear containers
    resourceContainer.innerHTML = '';
    productionContainer.innerHTML = '';

    // add current state of resources to container
    for (let resource of resources) {
        resourceContainer.innerHTML += `<p>${resource.name}: ${resource.quantity.toFixed(2)}</p>`;
    }

    // add current state of producers to container
    for (let producer of producers) {
        let costString = '';
        for (let resourceObj of producer.cost) {
            costString += `${resourceObj.amount.toFixed(2)} ${resourceObj.resource.name}, `;
        }
        costString = costString.slice(0, -2);  // trailing comma and space

        productionContainer.innerHTML += `
            <p>
                ${producer.name} (Level ${producer.level}): Produces ${producer.productionRate.toFixed(2)} 
                ${producer.resourceType.name} per second. Cost for next upgrade: 
                ${costString}
            </p>
            <button id="${producer.name}-upgrade">Upgrade ${producer.name}</button>
        `;
    }

    // event listeners for buttons
    for (let producer of producers) {
        document.getElementById(`${producer.name}-upgrade`).addEventListener('click', () => {
            producer.upgrade();
        })
    }
}







