import {DEFAULT_BUILDING_LEVEL, DEFAULT_CONSTRUCTION_TIME} from "../data/constants.js";
import Building from "./Building.js";
import eventBus from "../eventBus/EventBus.js";

class Producer extends Building {
    constructor({name, space, resourceType, productionRate, cost, level = DEFAULT_BUILDING_LEVEL, constructionTime = DEFAULT_CONSTRUCTION_TIME}) {
        super({name, space, cost, level, constructionTime});
        this.resourceType = resourceType;
        this.productionRate = productionRate;
        this.underConstruction = false;
    }


    // Override for the buildings.upgrade
    // Override for the buildings.upgrade
    upgrade() {
        this.level += 1;
        this.updateCost();
        this.productionRate *= this.level;
    }
}

export default Producer;