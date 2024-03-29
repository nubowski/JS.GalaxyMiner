import Building from "../modules/Building.js";
import Producer from "../modules/Producer.js";

const createBuilding = (type, building, resources) => {
    const newCost = building.cost.map(costObj => {
        let resource;
        if (typeof costObj.resource === 'string') {
            // If resource is a string, find the Resource object by name
            resource = resources.resourceInstances.find(res => res.name === costObj.resource);
            if (!resource) {
                throw Error(`Unknown resource: ${costObj.resource}`);
            }
        } else {
            // If resource is an object, use it directly
            resource = costObj.resource;
        }
        return {...costObj, resource};
    });

    const newBuilding = {...building, cost: newCost};

    switch (type) {
        case 'Building':
            return new Building(newBuilding, resources);
        case 'Producer':
            return new Producer(newBuilding, resources);
        default:
            throw Error(`Unknown Building Type: ${type}`);
    }
};

export default createBuilding;