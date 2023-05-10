class ResourceProducer {
    constructor(name, resourceType, productionRate, baseCost) {
        this.name = name;
        this.resourceType = resourceType;
        this.productionRate = productionRate;
        this.baseCost = baseCost;
        this.level = 1;
    }

    produce() {
        // inc player's res count of this.type by this.rate
        let amount = this.productionRate;
        this.resourceType.addQuantity(amount);
    }

    upgrade() {
        // inc this.rate and dec player's res count by this.cost
        let cost = Math.floor(this.baseCost * Math.pow(1.07, this.level));
        if (this.resourceType.subtractQuantity(cost)) {
            this.productionRate++;
            this.level++;
            this.cost = cost;
            console.log(`Upgrade ${this.name} to level ${this.level}!`);
        } else {
            console.log("Insufficient resources to upgrade!");
        }
    }

    updateResourceQuantity(seconds) {
        let amount = this.productionRate * seconds;
        this.resourceType.addQuantity(amount);
    }
}

export default ResourceProducer;