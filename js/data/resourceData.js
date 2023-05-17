import Resource from "../modules/Resource.js";
import eventBus from "../eventBus/EventBus.js";

eventBus.emit('createResource', {name: 'Metal', quantity: 1000});
eventBus.emit('createResource', {name: 'Carbon', quantity: 1000});

let metal = new Resource('Metal', 1000);
let carbon = new Resource('Carbon', 1000);

const resourceInstances = [metal, carbon];

export default resourceInstances;