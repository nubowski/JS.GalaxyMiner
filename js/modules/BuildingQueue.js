import EventBus from '../eventBus/EventBus.js';
import {DEFAULT_QUEUE_SIZE} from "../data/constants.js";
import createBuilding from "../utils/buildingFactory";

let eventBus = EventBus;  // Import instance

class BuildingQueue {
    constructor(maxSize = DEFAULT_QUEUE_SIZE) {
        this.queue = [];
        this.maxSize = maxSize;
        eventBus.on('createBuilding', (buildingInfo) => this.handleCreateBuilding(buildingInfo));

        // Event listener for 'timerTick' event
        eventBus.on('timerTick', () => {
            if (this.queue.length > 0) {
                let building = this.queue[0];
                building.remainingTime -= 1000; // Assuming a tickInterval of 1000 ms

                if (building.remainingTime <= 0) {
                    this.removeFromQueue();
                }
            }
        });
    }

    handleCreateBuilding(buildingInfo) {
        let building = createBuilding(buildingInfo.type, buildingInfo);
        this.addToQueue(building);
    }

    canAddToQueue(building) {
        // Here, we need to trigger a 'canReserveSpace' event, and
        // the BuildingManager should listen for this event and respond accordingly.
        // For the sake of simplicity, we'll assume that the BuildingManager always allows us to reserve space.
        return this.queue.length < this.maxSize;
    }

    addToQueue(building) {
        if (this.canAddToQueue(building)) {
            building.remainingTime = building.constructionTime; // initialize remaining time
            this.queue.push(building);
            building.subtractResourcesForBuilding(); // subtract resources
            // Emit an event to reserve space
            eventBus.emit('reserveSpace', building);
            // Emit an event to update queue display
            eventBus.emit('updateQueueDisplay', this.queue);
            return true;
        } else {
            return false;
        }
    }

    removeFromQueue () {
        if (this.queue.length > 0) {
            let building = this.queue.shift();
            // Emit an event to add the completed building
            eventBus.emit('addBuilding', building);
            // Emit an event to update queue display
            eventBus.emit('updateQueueDisplay', this.queue);
        }
    }

    getQueueLength() {
        return this.queue.length;
    }

    getNextBuilding() {
        return this.queue[0];
    }

    increaseSize(amount) {
        this.maxSize += amount;
    }

    getQueue() {
        return this.queue;
    }
}

export default BuildingQueue;