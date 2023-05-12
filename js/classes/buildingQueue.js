import {DEFAULT_QUEUE_SIZE} from "./constants.js";


class BuildingQueue {
    constructor(maxSize = DEFAULT_QUEUE_SIZE) {
        this.queue = [];
        this.maxSize = maxSize;
    }

    addToQueue(building) {
        if (this.queue.length < this.maxSize) {
            this.queue.push(building);
            return true;
        } else {
            return false;
        }
    }

    removeFromQueue () {
        return this.queue.shift();
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
}

export default BuildingQueue;