import {UPGRADE_COST_MULTIPLIER} from "./constants.js";

import Building from "./building.js";
import GameLog from "./gameLog.js";

//Init
let gameLog = new GameLog();

class Producer extends Building {
    constructor(name, space, resourceType, productionRate, cost) {
        super(name, space, cost);
        this.resourceType = resourceType;
        this.productionRate = productionRate;
    }

    produce() {
        // Increase player's resource count of this.type by this.rate
        let amount = this.productionRate;
        this.resourceType.addQuantity(amount);
    }

    upgrade() {
        let canUpgrade = true;
        for (let resourceObj of this.cost) {
            if (!resourceObj.resource.subtractQuantity(resourceObj.amount)) {
                canUpgrade = false;
                break;
            }
        }
        if (canUpgrade) {
            this.level++;
            this.productionRate *= this.level;
            this.cost.forEach(resourceObj => resourceObj.amount *= Math.pow(UPGRADE_COST_MULTIPLIER, this.level));
            gameLog.info(`Upgraded ${this.name} to level ${this.level}!`);
        } else {
            gameLog.negative("Insufficient resources to upgrade!");
        }
    }
}

export default Producer;