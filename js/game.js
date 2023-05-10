import Resource from './classes/resource.js';
import ResourceProducer from "./classes/resourceProducer";

// new instances of the res class for each of res
let iron = new Resource('Iron', 0, 1);
let copper = new Resource('Copper', 0, 0);
let titanium = new Resource('Titanium', 0, 0);
let energy = new Resource('Energy', 0, 0);

//access and modify the props
console.log(iron.name); // outputs 'Iron'
iron.updateQuantity(5); // Inc the q of iron by 5
console.log(iron.quantity); // outputs '5'