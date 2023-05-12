import {DEFAULT_QUEUE_SIZE} from "./constants.js";

class BuildingQueue {
    constructor(maxSize = DEFAULT_QUEUE_SIZE) {
        this.queue = [];
        this.maxSize = maxSize;
    }

    setGameState(gameState) {
        this.gameState = gameState;
    }

    addToQueue(building) {
        if (this.queue.length < this.maxSize) {
            this.queue.push(building);
            if (this.queue.length === 1) {
                this.startTimer(building);
            }
            return true;
        } else {
            return false;
        }
    }

    startTimer(building) {
        setTimeout(() => {
            // after time is up, remove the building from the queue
            this.queue.shift();
            // pull the building to the building manager
            this.gameState.buildingManager.addBuilding(building);
            // if there are buildings in the queue, start the next timer
            if (this.queue.length > 0) {
                this.startTimer(this.queue[0]);
            }
        }, building.constructionTime);
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