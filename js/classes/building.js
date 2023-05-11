class Building {
    constructor(name, cost, baseCost) {
        this.name = name;
        this.cost = cost.map(resourceObj => ({
            resource: resourceObj.resource,
            baseCost: resourceObj.baseCost,
            amount: resourceObj.baseCost
        }));
        this.baseCost = baseCost;
        this.level = 1;
    }

    build() {
        // add to build queue
    }

    upgrade() {
        // increase level and update cost
    }
}

export default Building;