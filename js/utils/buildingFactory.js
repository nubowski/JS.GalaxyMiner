import Building from "../modules/Building.js";
import Producer from "../modules/Producer.js";

const createBuilding = (type, building, resources) => {

    // Create a new cost array with actual Resource instances, without mutating the original building
    const newCost = building.cost.map(costObj => {
        const resource = resources.find(res => res.name === costObj.resource);
        if (!resource) throw Error(`Unknown resource: ${costObj.resource}`);
        return {...costObj, resource};
    });

    // Create a new building object with the mapped cost array
    const newBuilding = {...building, cost: newCost};

    switch (type) {
        case 'Building':
            return new Building(newBuilding);
        case 'Producer':
            return new Producer(newBuilding);
        default:
            throw Error(`Unknown Building Type: ${type}`);
    }
};

export default createBuilding;