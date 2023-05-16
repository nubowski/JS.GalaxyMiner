const buildingData = {
    'Metal Drill': {
        type: 'Producer',
        name: 'Metal Drill',
        space: 2,
        level: 1,
        constructionTime: 10000,
        resourceType: 'Metal',
        productionRate: 1,
        cost: [
            {resource: 'Metal', baseCost: 10}
        ]
    },
    'Carbon Extractor': {
        type: 'Producer',
        name: 'Carbon Extractor',
        space: 2,
        level: 1,
        constructionTime: 5000,
        resourceType: 'Carbon',
        productionRate: 1,
        cost: [
            {resource: 'Metal', baseCost: 30},
            {resource: 'Carbon', baseCost: 50}
        ]
    }
    // more buildings
};


export default buildingData;