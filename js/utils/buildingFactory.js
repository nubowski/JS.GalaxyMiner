import Building from "../modules/Building.js";
import Producer from "../modules/Producer.js";

const createBuilding = (type, building, resources) => {
    console.log(building); // Add this line to check what is passed into the function

    // Replace resource names in cost array with actual Resource instances
    building.cost = building.cost.map(costObj => {
        const resource = resources.find(res => res.name === costObj.resource);
        if (!resource) throw Error(`Unknown resource: ${costObj.resource}`);
        return {...costObj, resource};
    });

    switch (type) {
        case 'Building':
            return new Building(building);
        case 'Producer':
            return new Producer(building);
        default:
            throw Error(`Unknown Building Type: ${type}`);
    }
};

export default createBuilding;