import Resource from "./resource.js";

let metal = new Resource('Metal', 1000);
let carbon = new Resource('Carbon', 1000);

const buildingData = {
    'Metal Drill': {
        type: 'Producer',
        name: 'Metal Drill',
        space: 2,
        level: 1,
        constructionTime: 10000,
        resourceType: metal,
        productionRate: 1,
        cost: [
            {resource: metal, baseCost: 10}
        ]
    },
    'Carbon Extractor': {
        type: 'Producer',
        name: 'Carbon Extractor',
        space: 2,
        level: 1,
        constructionTime: 5000,
        resourceType: carbon,
        productionRate: 1,
        cost: [
            {resource: metal, baseCost: 30},
            {resource: carbon, baseCost: 50}
        ]
    }
    // more buildings as needed
};

export default buildingData;