import Resource from './classes/resource.js';
import ResourceProducer from "./classes/resourceProducer.js";

import {UPGRADE_COST_MULTIPLIER} from "./classes/constants";

// Init resources
let metal = new Resource('Metal', 0);

// Init producers

let metalDrill = new ResourceProducer('Metal Drill', metal, 1, 10);

// Array to hold all prods
let producers = [metalDrill];

// Game Loop
setInterval(update, 1000);

// Update function
function update() {
    // Each produce on every prod
    for (let producer of producers) {
        producer.produce();
        if (metal.quantity >= metalDrill.baseCost) {
            metalDrill.upgrade();
        }
    }

    // Update the UI
    updateUI();

    // Some debug
    console.log(`Metal: ${metal.quantity}`);
}

function updateUI() {
    // get containers
    let resourceContainer = document.getElementById('resources-container');
    let productionContainer = document.getElementById('production-container');

    // clear containers
    resourceContainer.innerHTML = '';
    productionContainer.innerHTML = '';

    // add current state of resources to container
    resourceContainer.innerHTML += `<p>${metal.name}: ${metal.quantity.toFixed(2)}</p>`;

    // add current state of producers to container
    for (let producer of producers) {
        productionContainer.innerHTML += `<p>${producer.name} (Level ${producer.level}): ` +
        `Produces ${producer.productionRate.toFixed(2)} per second. ` +
        `Cost for next upgrade: ${producer.baseCost * Math.pow(UPGRADE_COST_MULTIPLIER, producer.level)}</p>`;
    }
}







