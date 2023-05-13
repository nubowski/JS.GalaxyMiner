import {DEFAULT_BUILDING_LEVEL, DEFAULT_CONSTRUCTION_TIME, UPGRADE_COST_MULTIPLIER} from "../data/constants";
import Building from "./building.js";

class Producer extends Building {
    constructor({name, space, resourceType, productionRate, cost, level = DEFAULT_BUILDING_LEVEL, constructionTime = DEFAULT_CONSTRUCTION_TIME}) {
        super({name, space, cost, level, constructionTime});
        this.resourceType = resourceType;
        this.productionRate = productionRate;
        this.underConstruction = false;
    }

    setGameState(gameState) {
        console.log("Setting gameState in Producer", gameState);
        this.gameState = gameState;
    }

    produce() {
        if (!this.underConstruction) {
            // Increase player's resource count of this.type by this.rate
            let amount = this.productionRate;
            this.resourceType.addQuantity(amount);
        }
    }

    // Override for the buildings.upgrade
    upgrade() {
        console.log("gameState in upgrade", this.gameState);
        if (this.hasSufficientResources() && !this.underConstruction) {
            if (this.gameState.buildingQueue.addToQueue(this, 'upgrade')) {
                this.gameState.gameLog.info(`Upgrade of ${this.name} has been added to the building queue.`);
            } else {
                this.gameState.gameLog.error("Building queue is full!");
            }
        } else {
            if (!this.hasSufficientResources()) {
                this.gameState.gameLog.negative("Insufficient resources to upgrade!")
            }
            if (this.underConstruction) {
                this.gameState.gameLog.negative("The building is currently under construction!");
            }
        }
    }
}

export default Producer;