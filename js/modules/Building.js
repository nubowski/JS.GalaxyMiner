import eventBus from "../eventBus/EventBus.js";
import {DEFAULT_BUILDING_LEVEL, DEFAULT_CONSTRUCTION_TIME, UPGRADE_COST_MULTIPLIER} from "../data/constants.js";

class Building {
    static idCounter = 0;
    constructor({ name, space, cost, level = DEFAULT_BUILDING_LEVEL, constructionTime = DEFAULT_CONSTRUCTION_TIME, type}, resourceManager) {
        if (!resourceManager) {
            throw new Error('ResourceManager is undefined');
        }
        this.id = Building.idCounter++;
        this.status = "idle";
        this.name = name;
        this.space = space;
        this.level = level;
        this.type = type;
        this.constructionTime = constructionTime;
        this.resourceManager = resourceManager;
        this.remainingTime = this.constructionTime;
        this.cost = cost.map(resourceObj => ({
            resource: resourceManager.getResourceByName(resourceObj.resource.name),
            baseCost: resourceObj.baseCost,
            amount: resourceObj.baseCost
        }));

        eventBus.on('spaceReserved', (building) => {
            if (building === this) {
                // Space was successfully reserved for this building, so continue with the building process
                this.build();
            }
        });

        eventBus.on('spaceReservationFailed', (building) => {
            if (building === this) {
                // Space could not be reserved for this building, so log an error message
                eventBus.emit('log.negative',"Not enough space to build!");
            }
        });
    }

    setLevel(level) {
        this.level = level;
    }

    build() {
        if (this.hasSufficientResources()) {
            eventBus.emit('canReserveSpace', this);
        } else {
            eventBus.emit('log.negative',"Insufficient resources to build!")
        }
    }

    upgrade() {
        // Upgrade logic goes here
        this.status = "upgrade";
    }

    updateCost() {
        for (let resourceObj of this.cost) {
            resourceObj.amount = Math.floor(resourceObj.baseCost * Math.pow(UPGRADE_COST_MULTIPLIER, this.level));
        }
    }

    hasSufficientResources() {
        for (let resourceObj of this.cost){
            if (!this.resourceManager.canSubtract(resourceObj.resource.name, resourceObj.amount)) {
                return false;
            }
        }
        return true;
    }

    subtractResourcesForBuilding() {
        for (let resourceObj of this.cost){
            this.resourceManager.subtractQuantity(resourceObj.resource.name, resourceObj.baseCost);
        }
    }
}

export default Building;