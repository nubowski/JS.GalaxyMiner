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

        eventBus.on('setBuildings', (buildingData) => {
            this.buildings = buildingData.map(
                buildingData => createBuilding(buildingData.type, {...buildingData}, this.resources)
            );
        });

        eventBus.on('attemptToBuild', (buildingInfo) => {
            console.log('BuildingManager, attemptToBuild event, buildingInfo:', buildingInfo);
            let buildingData = this.buildingTemplates.find(template => template.name === buildingInfo.name);
            if (!buildingData) {
                console.error(`Unknown building: ${buildingInfo.name}`);
                return;
            }
            let newBuilding = createBuilding(buildingData.type, buildingData, this.resources);
            this.addToQueue(newBuilding);
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
            }
            this.updateProducers();
        });

        eventBus.on('attemptToUpgrade', ({buildingID, buildings}) => this.upgradeBuilding(buildingID, buildings));
        eventBus.on('setBuildingQueue', this.setBuildingQueue.bind(this));
        eventBus.on('clearBuildings', this.clearBuildings.bind(this));
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

    canAddToQueue(building, isUpgrade = false) {
        if (isUpgrade) {
            return this.queue.length < this.maxSize;
        } else {
            return (this.queue.length < this.maxSize) && (this.usedSpaces + this.reservedSpaces + building.space <= this.maxSpaces);
        }
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
        if (this.canAddToQueue(building, isUpgrade) && building.hasSufficientResources()) {
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
            console.error('Did not pass addToQueue checks!');
            return false;
        }
    }

    removeFromQueue() {
        if (this.queue.length > 0) {
            let building = this.queue.shift();
            if (building.isUpgrade) {
                building.upgrade();
                // Find the original building in this.buildings and replace it with the upgraded building
                const originalBuildingIndex = this.buildings.findIndex(b => b.id === building.id);
                if (originalBuildingIndex !== -1) {
                    this.buildings[originalBuildingIndex] = building;
                }
            } else {
                // If it's not an upgrade, add the building normally
                this.addBuilding(building);
            }
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

    setBuildingQueue(queue) {
        this.queue = [];
        for (let id of queue) {
            let building = this.getBuiltBuildings().find(building => building.id === id);
            if (building) {
                this.addToQueue(building);
            }
        }
    }

    clearBuildings() {
        this.buildings = [];
        this.queue = [];
        this.usedSpaces = 0;
        this.reservedSpaces = 0;
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