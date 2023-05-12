import {DEFAULT_BUILDING_LEVEL, DEFAULT_CONSTRUCTION_TIME, UPGRADE_COST_MULTIPLIER} from "./constants.js";
import Building from "./building.js";

class Producer extends Building {
    constructor(name, space, level = DEFAULT_BUILDING_LEVEL, constructionTime = DEFAULT_CONSTRUCTION_TIME, resourceType, productionRate, cost) {
        super(name, space, level, constructionTime, cost);
        this.resourceType = resourceType;
        this.productionRate = productionRate;
        this.underConstruction = false;
    }

    setGameState(gameState) {
        this.gameState = gameState;
    }

    produce() {
        if (!this.underConstruction) {
            // Increase player's resource count of this.type by this.rate
            let amount = this.productionRate;
            this.resourceType.addQuantity(amount);
        }
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
            this.underConstruction = true;
            setTimeout(() => {
                this.underConstruction = false;
                this.level++;
                this.productionRate *= this.level;
                this.cost.forEach(resourceObj => resourceObj.amount *= Math.pow(UPGRADE_COST_MULTIPLIER, this.level));
                this.gameState.gameLog.info(`Upgraded ${this.name} to level ${this.level}!`);
            }, this.constructionTime);
        } else {
            this.gameState.gameLog.negative("Insufficient resources to upgrade!");
        }
    }
}

export default Producer;