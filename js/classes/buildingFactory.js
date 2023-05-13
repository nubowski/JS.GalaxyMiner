import Building from "./building.js";
import Producer from "./producer.js";

const createBuilding = (type, options, resources) => {
    // Replace resource names in cost array with actual Resource instances
    options.cost = options.cost.map(costObj => {
        const resource = resources.find(res => res.name === costObj.resource);
        if (!resource) throw Error(`Unknown resource: ${costObj.resource}`);
        return {...costObj, resource};
    });

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