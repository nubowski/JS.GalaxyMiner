import {DEFAULT_BUILDING_LEVEL, DEFAULT_CONSTRUCTION_TIME, UPGRADE_COST_MULTIPLIER} from "./constants.js";

class Building {
    constructor(name, space, level = DEFAULT_BUILDING_LEVEL, constructionTime = DEFAULT_CONSTRUCTION_TIME, cost) {
        this.name = name;
        this.space = space;
        this.level = 0;
        this.constructionTime = constructionTime;
        this.cost = cost.map(resourceObj => ({
            resource: resourceObj.resource,
            baseCost: resourceObj.baseCost,
            amount: resourceObj.baseCost
        }));
    }

    setGameState(gameState) {
        this.gameState = gameState;
    }

    setLevel(level) {
        this.level = level;
    }

    build(buildingManager) {
        if (this.hasSufficientResources() && buildingManager.hasSufficientSpace(this)) {
            if (buildingManager.addBuilding(this)) {
                this.subtractResourcesForBuilding();
                this.gameState.gameLog.info(`Built ${this.name}!`);
            } else {
                this.gameState.gameLog.error("Unexpected Error!");
            }
        } else {
            if (!this.hasSufficientResources()) {
                this.gameState.gameLog.negative("Insufficient resources to build!")
            }
            if (!buildingManager.hasSufficientSpace(this)) {
                this.gameState.gameLog.negative("Not enough space to build!");
            }
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
            this.level++;
            this.cost.forEach(resourceObj => resourceObj.amount *= Math.pow(UPGRADE_COST_MULTIPLIER, this.level));
            this.gameState.gameLog.info(`Upgraded ${this.name} to level ${this.level}!`);
        } else {
            this.gameState.gameLog.negative("Insufficient resources to upgrade!");
        }
    }

    updateCost() {
        for (let resourceObj of this.cost) {
            resourceObj.amount = Math.floor(resourceObj.baseCost * Math.pow(UPGRADE_COST_MULTIPLIER, this.level));
        }
    }

    hasSufficientResources() {
        for (let resourceObj of this.cost){
            if (!resourceObj.resource.canSubtract(resourceObj.amount)) {
                return false;
            }
        }
        return true;
     }

    subtractResourcesForBuilding() {
        for (let resourceObj of this.cost) {
            resourceObj.resource.subtractQuantity(resourceObj.amount);
        }
    }
}

export default Building;