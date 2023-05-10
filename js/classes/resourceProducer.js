class ResourceProducer {
    constructor(name, resourceType, productionRate, cost) {
        this.name = name;
        this.resourceType = resourceType;
        this.productionRate = productionRate;
        this.cost = cost;
    }

    produce() {
        // inc player's res count of this.type by this.rate
        let amount = this.productionRate;
        this.resourceType.addQuantity(amount);
    }

    upgrade() {
        // inc this.rate and dec player's res count by this.cost
    }

    updateResourceQuantity(seconds) {
        let amount = this.productionRate * seconds;
        this.resourceType.addQuantity(amount);
    }
}

export default ResourceProducer;