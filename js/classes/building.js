import {DEFAULT_BUILDING_LEVEL, DEFAULT_CONSTRUCTION_TIME, UPGRADE_COST_MULTIPLIER} from "./constants.js";

class Building {
    constructor({ name, space, cost, level = DEFAULT_BUILDING_LEVEL, constructionTime = DEFAULT_CONSTRUCTION_TIME }) {
        this.name = name;
        this.space = space;
        this.level = 0;
        this.constructionTime = constructionTime;
        this.cost = cost.map(resourceObj => ({
            resource: resourceObj.resource,
            baseCost: resourceObj.baseCost,
            amount: resourceObj.baseCost
        }));
        this.remainingTime = this.constructionTime;
    }

    setGameState(gameState) {
        if (!gameState.gameLog) {
            throw new Error('gameLog is not defined in gameState');
        }
        this.gameState = gameState;
    }

    setLevel(level) {
        this.level = level;
    }

    build() {
        if (this.hasSufficientResources() && this.gameState.buildingManager.hasSufficientSpace(this)) {
            if (this.gameState.buildingQueue.addToQueue(this)) {
                this.remainingTime = this.constructionTime;
                this.subtractResourcesForBuilding();
                this.gameState.gameLog.info(`Added ${this.name} to the building queue.`);
            } else {
                this.gameState.gameLog.error("Building queue is full!");
            }
        } else {
            if (!this.hasSufficientResources()) {
                this.gameState.gameLog.negative("Insufficient resources to build!")
            }
            if (!this.gameState.buildingManager.hasSufficientSpace(this)) {
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