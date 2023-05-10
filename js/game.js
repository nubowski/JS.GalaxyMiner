import Resource from './classes/resource.js';
import ResourceProducer from "./classes/resourceProducer.js";

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
    }

    // Some debug
    console.log(`Metal: ${metal.quantity}`);
}







