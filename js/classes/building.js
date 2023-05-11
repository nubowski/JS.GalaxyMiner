import GameLog from "./gameLog.js";

import {UPGRADE_COST_MULTIPLIER} from "./constants.js";

// Init GameLog info
let gameLog = new GameLog();

class Building {
    constructor(name, space, cost) {
        this.name = name;
        this.space = space;
        this.level = 0;
        this.cost = cost.map(resourceObj => ({
            resource: resourceObj.resource,
            baseCost: resourceObj.baseCost,
            amount: resourceObj.baseCost
        }));
    }

    build() {
        // Set level to 1 and subtract cost from player's resources
        let canBuild = true;
        for (let resourceObj of this.cost) {
            if (!resourceObj.resource.subtractQuantity(resourceObj.amount)) {
                canBuild = false;
                break;
            }
        }
        if (canBuild) {
            this.level = 1;
            gameLog.info(`Built ${this.name}!`);
        } else {
            gameLog.negative("Insufficient resources to build!");
        }
    }

    upgrade() {
        // Increase level and subtract upgrade cost from player's resources
        let canUpgrade = true;
        for (let resourceObj of this.cost) {
            if (!resourceObj.resource.subtractQuantity(resourceObj.amount)) {
                canUpgrade = false;
                break;
            }
        }
        if (canUpgrade) {
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

export default Building;