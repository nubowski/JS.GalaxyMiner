import eventBus from '../eventBus/EventBus.js';
import {MAX_BUILDING_SPACE, DEFAULT_BUILDING_LEVEL, DEFAULT_QUEUE_SIZE} from "../data/constants.js";
import createBuilding from "../utils/buildingFactory.js";

class BuildingManager {
    constructor(buildingTemplates, resources, maxSpaces = MAX_BUILDING_SPACE, maxSize = DEFAULT_QUEUE_SIZE) {
        this.buildingTemplates = buildingTemplates;
        this.maxSpaces = maxSpaces;
        this.resources = resources;
        this.usedSpaces = 0;
        this.reservedSpaces = 0;
        this.buildings = [];
        this.builtBuildings = [];
        this.queue = [];
        this.maxSize = maxSize;

        eventBus.on('attemptToBuild', (buildingInfo) => {
            console.log("Event received: ", buildingInfo);
            // find data by name
            let buildingData = this.buildingTemplates.find(template => template.name === buildingInfo.name);
            // check if the building data exists
            if (!buildingData) {
                console.error(`Unknown building: ${buildingInfo.name}`);
                return;
            }
            // new building
            let newBuilding = createBuilding(buildingData.type, buildingData, this.resources);
            // add new building
            this.addBuilding(newBuilding);
        });

        // Event listener for `timerTick` event
        eventBus.on('timerTick', () => {
            if (this.queue.length > 0) {
                let building = this.queue[0];
                building.remainingTime -= 1000; // 1s But to refactor on var later on (assuming on tick)

                if(building.remainingTime <= 0) {
                    this.removeFromQueue();
                }
            }
        })
    }

    handleCreateBuilding(buildingInfo) {
        let building = createBuilding(buildingInfo.type, buildingInfo);
        this.addToQueue(building);
    }

    canAddToQueue(building) {
        return (this.queue.length < this.maxSize) && (this.usedSpaces +this.reservedSpaces + building.space <= this.maxSpaces); // TODO to complex shit. Just add `space` param while its in queue
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
            this.builtBuildings.push(building);
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
        return this.builtBuildings;
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