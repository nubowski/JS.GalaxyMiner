import Building from './building.js';
import {UPGRADE_COST_MULTIPLIER} from "./constants.js";
import GameLog from "./gameLog.js";

// Init GameLog info
let gameLog = new GameLog();

class Producer extends Building {
    constructor(name, resourceType, productionRate, cost) {
        super(name, cost);
        this.resourceType = resourceType;
        this.productionRate = productionRate;
    }

    produce() {
        // increase player's resource count of this.type by this.rate
        let amount = this.productionRate;
        this.resourceType.addQuantity(amount);
    }

    upgrade() {
        // increase this.rate and decrease player's resource count by this.cost
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
            gameLog.info(`Upgraded ${this.name} to level ${this.level}!`);
        } else {
            gameLog.negative("Insufficient resources to upgrade!");
        }
    }

    updateCost() {
        for (let resourceObj of this.cost) {
            resourceObj.amount = Math.floor(resourceObj.baseCost * Math.pow(UPGRADE_COST_MULTIPLIER, this.level));
        }
    }
}

export default Producer;