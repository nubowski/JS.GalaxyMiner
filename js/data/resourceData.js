import eventBus from "../eventBus/EventBus.js";

eventBus.emit('createResource', {name: 'Metal', quantity: 1000});
eventBus.emit('createResource', {name: 'Carbon', quantity: 1000});
