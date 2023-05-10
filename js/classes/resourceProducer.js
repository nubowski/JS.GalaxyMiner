class ResourceProducer {
    constructor(name, resourceType, productionRate, cost) {
        this.name = name;
        this.resourceType = resourceType;
        this.productionRate = productionRate;
        this.cost = cost;
    }

    produce() {
        // inc player's res count of this.type by this.rate
    }

    upgrade() {
        // inc this.rate and dec player's res count by this.cost
    }
}

export default ResourceProducer;