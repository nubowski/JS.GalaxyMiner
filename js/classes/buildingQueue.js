import {DEFAULT_QUEUE_SIZE} from "./constants.js";

class BuildingQueue {
    constructor(maxSize = DEFAULT_QUEUE_SIZE) {
        console.log(`Initial max queue size: ${maxSize}`);
        this.queue = [];
        this.maxSize = maxSize;
        this.isAdding = false; // try for lock
    }

    setGameState(gameState) {
        this.gameState = gameState;
    }

    addToQueue(building) {
        console.log(`Current queue size: ${this.queue.length}, Max queue size: ${this.maxSize}`);
        if (this.queue.length < this.maxSize) {
            this.queue.push(building);
            // start a timer if this is the only building in the queue
            if (this.queue.length === 1) {
                this.startTimer(building);
            }
            return true;
        } else {
            return false;
        }
    }

    startTimer() {
        let building = this.queue[0];
        if (building !== null) {
            setTimeout(() => {
                this.removeFromQueue();
                if (this.queue.length > 0) {
                    this.startTimer();
                }
            }, building.constructionTime);
        }
    }

    removeFromQueue () {
        if (this.queue.length > 0) {
            return this.queue.shift();
        } else {
            return null;
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
}

export default BuildingQueue;