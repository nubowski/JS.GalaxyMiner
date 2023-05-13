import {DEFAULT_BUILDING_LEVEL, DEFAULT_CONSTRUCTION_TIME, UPGRADE_COST_MULTIPLIER} from "../data/constants";
import Building from "./Building.js";
import eventBus from "../eventBus/EventBus.js";

class Producer extends Building {
    constructor({name, space, resourceType, productionRate, cost, level = DEFAULT_BUILDING_LEVEL, constructionTime = DEFAULT_CONSTRUCTION_TIME}) {
        super({name, space, cost, level, constructionTime});
        this.resourceType = resourceType;
        this.productionRate = productionRate;
        this.underConstruction = false;
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
        if (this.hasSufficientResources() && !this.underConstruction) {
            eventBus.emit('canAddToQueue', this);
        } else {
            if (!this.hasSufficientResources()) {
               eventBus.emit('log.negative',"Insufficient resources to upgrade!")
            }
            if (this.underConstruction) {
                eventBus.emit('log.negative',"The building is currently under construction!");
            }
        }
    }
}

export default Producer;