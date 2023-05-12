import Building from "./building.js";
import Producer from "./producer.js";

const createBuilding = (type, ...params) => {
    switch (type) {
        case 'Building':
            return new Building(...params);
        case 'Producer':
            return new Producer(...params);
        default:
            throw Error(`Unknown Building Type: ${type}`); // use Error or use own logs???
    }
};

export default createBuilding;