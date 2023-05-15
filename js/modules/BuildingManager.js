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
                    building.underConstruction = false;
                    eventBus.emit('buildingUpdated', this.getBuiltBuildings());
                }

                // Emit 'queueUpdated' event whenever the timer ticks
                eventBus.emit('updateQueueDisplay', this.queue);

                // Update all producers
            }
            this.updateProducers();
        });

        eventBus.on('attemptToUpgrade', ({buildingID, buildings}) => this.upgradeBuilding(buildingID, buildings));
    }

    updateProducers() {
        for (let building of this.buildings) {
            if (building instanceof Producer && !building.underConstruction && building.status !== "upgrade") {
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

    addToQueue(building, isUpgrade = false) {
        if (this.canAddToQueue(building) && building.hasSufficientResources()) {
            building.remainingTime = building.constructionTime;
            building.isUpgrade = isUpgrade;
            this.queue.push(building);
            building.subtractResourcesForBuilding();
            if (!isUpgrade) {
                this.reservedSpaces += building.space;
            }
            eventBus.emit('updateQueueDisplay', this.queue);
            eventBus.emit('constructionStarted', building);
            eventBus.emit('buildingSpaceUpdated', this);
            return true;
        } else {
            return false;
        }
    }

    removeFromQueue() {
        if (this.queue.length > 0) {
            let building = this.queue.shift();
            if (building.isUpgrade) {
                building.upgrade();
                // Remove the original building from this.buildings
                this.removeBuilding(building);
            }
            this.addBuilding(building);
            eventBus.emit('updateQueueDisplay', this.queue);
            eventBus.emit('buildingUpdated', this.buildings);
        }
    }

    addBuilding(building, initialLevel = DEFAULT_BUILDING_LEVEL) {
        if (this.usedSpaces + building.space <= this.maxSpaces) {
            this.buildings.push(building);
            this.usedSpaces += building.space;
            this.reservedSpaces -= building.space;
            if (!building.isUpgrade) {
                building.setLevel(initialLevel);
            }
            eventBus.emit('buildingUpdated', this.getBuiltBuildings());
            eventBus.emit('buildingSpaceUpdated', this);
        } else {
            console.log("Not enough space to add building.");
            // Emit an error event or handle this error in another way
        }
    }

    upgradeBuilding(buildingID, buildings) {
        const buildingIndex = buildings.findIndex(building => building.id === buildingID);
        if (buildingIndex !== -1) {
            const building = buildings[buildingIndex];
            if (building.hasSufficientResources() && !building.underConstruction) {
                if (this.addToQueue(building, true)) { // Only subtract resources if building is added to queue
                    building.subtractResourcesForBuilding();
                    building.underConstruction = true; // Mark the building as under construction
                } else {
                    eventBus.emit('log.negative', "Queue is full!");
                }
            } else {
                if (!building.hasSufficientResources()) {
                    eventBus.emit('log.negative', "Insufficient resources to upgrade!")
                }
                if (building.underConstruction) {
                    eventBus.emit('log.negative', "The building is currently under construction!");
                }
            }
        } else {
            console.error(`Building with ID: ${buildingID} not found`);
        }
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