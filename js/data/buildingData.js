const buildingData = {
    'Metal Drill': {
        type: 'Producer',
        name: 'Metal Drill',
        description: 'A heavy-duty drill that extracts metal from the ground.',
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
        description: 'An advanced machine that pulls carbon from the atmosphere.',
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