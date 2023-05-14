import eventBus from "../eventBus/EventBus.js";
import {DEFAULT_BUILDING_LEVEL, DEFAULT_CONSTRUCTION_TIME, UPGRADE_COST_MULTIPLIER} from "../data/constants.js";

class Building {
    constructor({ name, space, cost, level = DEFAULT_BUILDING_LEVEL, constructionTime = DEFAULT_CONSTRUCTION_TIME }) {
        this.name = name;
        this.space = space;
        this.level = level;
        this.constructionTime = constructionTime;
        this.cost = cost.map(resourceObj => ({
            resource: resourceObj.resource,
            baseCost: resourceObj.baseCost,
            amount: resourceObj.baseCost
        }));
        this.remainingTime = this.constructionTime;

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