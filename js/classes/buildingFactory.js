import Building from "./building.js";
import Producer from "./producer.js";

const createBuilding = (type, options) => {
    switch (type) {
        case 'Building':
            return new Building(options);
        case 'Producer':
            return new Producer(options);
        default:
            throw Error(`Unknown Building Type: ${type}`); // use Error or use own logs???
    }
};

export default createBuilding;