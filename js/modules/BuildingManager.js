import eventBus from '../eventBus/EventBus.js';
import {MAX_BUILDING_SPACE, DEFAULT_BUILDING_LEVEL, DEFAULT_QUEUE_SIZE} from "../data/constants.js";
import createBuilding from "../utils/buildingFactory.js";
import Producer from "./Producer.js";

class BuildingManager {
    constructor(buildingTemplates, resources, maxSpaces = MAX_BUILDING_SPACE, maxSize = DEFAULT_QUEUE_SIZE) {
        this.buildingTemplates = buildingTemplates;
        this.maxSpaces = maxSpaces;
        this.resources = resources;
        this.usedSpaces = 0;
        this.reservedSpaces = 0;
        this.buildings = [];
        this.queue = [];
        this.maxSize = maxSize;

        // Event listener for 'attemptToBuild' event
        eventBus.on('attemptToBuild', (buildingInfo) => {
            // find data by name
            let buildingData = this.buildingTemplates.find(template => template.name === buildingInfo.name);
            // check if the building data exists
            if (!buildingData) {
                console.error(`Unknown building: ${buildingInfo.name}`);
                return;
            }
            // new building
            let newBuilding = createBuilding(buildingData.type, buildingData, this.resources);
            // add new building to the queue if there's enough space and the queue isn't full
            if (this.canAddToQueue(newBuilding)) {
                this.addToQueue(newBuilding);
            } else {
                console.error(`Not enough space or queue is full.`);
            }
        });

        eventBus.on('timerTick', () => {
            if (this.queue.length > 0) {
                const building = this.queue[0];
                building.remainingTime -= 1000; // reduce remaining time by one second

                if (building.remainingTime <= 0) {
                    // if construction time has elapsed, remove building from queue
                    this.removeFromQueue();
                    eventBus.emit('buildingUpdated', this.getBuiltBuildings());
                }

                // Emit 'queueUpdated' event whenever the timer ticks
                eventBus.emit('updateQueueDisplay', this.queue);

                // Update all producers
            }
            this.updateProducers();
        });
    }

    updateProducers() {
        for (let building of this.buildings) {
            if (building instanceof Producer && !building.underConstruction) {
                eventBus.emit('produceResource', {
                    resourceType: building.resourceType,
                    productionRate: building.productionRate,
                });
            }
        }
    }


    canAddToQueue(building) {
        return (this.queue.length < this.maxSize) && (this.usedSpaces +this.reservedSpaces + building.space <= this.maxSpaces); // TODO too complex shit. Just add `space` param while its in queue
    }

    canReserveSpace(building) {
        return (this.usedSpaces + this.reservedSpaces + building.space) <= this.maxSpaces;
    }

    removeBuilding(building) {
        const index = this.buildings.indexOf(building);
        if (index > -1) {
            this.buildings.splice(index, 1);
            this.usedSpaces -= building.space;
            return true;
        }
        return false;
    }

    addToQueue(building) {
        if (this.canAddToQueue(building)) {
            building.remainingTime = building.constructionTime;
            this.queue.push(building);
            building.subtractResourcesForBuilding();
            this.reservedSpaces += building.space;
            eventBus.emit('updateQueueDisplay', this.queue);
            eventBus.emit('constructionStarted', building);
            return true;
        } else {
            return false;
        }
    }

    removeFromQueue() {
        if (this.queue.length > 0) {
            let building = this.queue.shift();
            this.addBuilding(building);
            eventBus.emit('updateQueueDisplay', this.queue);
        }
    }

    addBuilding(building, initialLevel = DEFAULT_BUILDING_LEVEL) {
        if (this.usedSpaces + building.space <= this.maxSpaces) {
            this.buildings.push(building);
            this.usedSpaces += building.space;
            this.reservedSpaces -= building.space;
            building.setLevel(initialLevel);
            eventBus.emit('buildingUpdated', this.getBuiltBuildings());
        } else {
            console.log("Not enough space to add building.");
            // Emit an error event or handle this error in another way
        }
    }

    upgradeBuilding(building) {
        const index = this.buildings.indexOf(building);
        if (index > -1) {
            building.level += 1;
            // Adjust other building properties here as necessary
            eventBus.emit('buildingUpdated', this.getBuiltBuildings());
            return true;
        }
        return false;
    }

    getBuiltBuildings() {
        return this.buildings;
    }

    getQueueLength () {
        return this.queue.length;
    }

    getNextBuilding () {
        return this.queue[0];
    }

    getQueue() {
        return this.queue;
    }
}


export default BuildingManager;