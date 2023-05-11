import Building from "./building.js";

class Producer extends Building {
    constructor(name, resourceType, productionRate, cost) {
        super(name, cost);
        this.resourceType = resourceType;
        this.productionRate = productionRate;
    }

    produce() {
        // Increase player's resource count of this.type by this.rate
        let amount = this.productionRate;
        this.resourceType.addQuantity(amount);
    }
}

export default Producer;