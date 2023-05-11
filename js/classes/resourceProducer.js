import {UPGRADE_COST_MULTIPLIER} from "./constants.js";

import GameLog from "./gameLog.js";

// Init GameLog info
let gameLog = new GameLog();

class ResourceProducer {
    constructor(name, resourceType, productionRate, cost) {
        this.name = name;
        this.resourceType = resourceType;
        this.productionRate = productionRate;
        this.level = 1;
        this.cost = cost.map(resourceObj => ({
            resource: resourceObj.resource,
            baseCost: resourceObj.baseCost,
            amount: resourceObj.baseCost
        }));
    }

    produce() {
        // inc player's res count of this.type by this.rate
        let amount = this.productionRate;
        this.resourceType.addQuantity(amount);
    }

    upgrade() {
        // inc this.rate and dec player's res count by this.cost
        let canUpgrade = true;
        for (let resourceObj of this.cost) {
            if (!resourceObj.resource.subtractQuantity(resourceObj.amount)) {
                canUpgrade = false;
                break;
            }
        }
        if (canUpgrade) {
            this.productionRate++;
            this.level++;
            this.updateCost();
            gameLog.addToLog(`Upgraded ${this.name} to level ${this.level}!`);
        } else {
            gameLog.addToLog("Insufficient resources to upgrade!");
        }
    }

    updateCost() {
        for (let resourceObj of this.cost) {
            resourceObj.amount = Math.floor(resourceObj.baseCost * Math.pow(UPGRADE_COST_MULTIPLIER, this.level));
        }
    }
}

export default ResourceProducer;