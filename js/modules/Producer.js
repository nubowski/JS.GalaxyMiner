import {DEFAULT_BUILDING_LEVEL, DEFAULT_CONSTRUCTION_TIME} from "../data/constants.js";
import Building from "./Building.js";


class Producer extends Building {
    constructor({name, space, resourceType, productionRate, cost, level = DEFAULT_BUILDING_LEVEL, constructionTime = DEFAULT_CONSTRUCTION_TIME, type}, resourceManager) {
        super({name, space, cost, level, constructionTime, type}, resourceManager);
        this.resourceType = resourceType;
        this.productionRate = productionRate;
        this.underConstruction = false;
    }

    upgrade() {
        // simple upgrade override for producers. add prodRate and levels
        this.level += 1;
        this.updateCost();
        this.productionRate *= this.level;
        this.underConstruction = true;
    }
}

export default Producer;