import {DEFAULT_QUEUE_SIZE} from "./constants.js";

class BuildingQueue {
    constructor(maxSize = DEFAULT_QUEUE_SIZE) {
        console.log(`Initial max queue size: ${maxSize}`);
        this.queue = [];
        this.maxSize = maxSize;
    }

    setGameState(gameState) {
        this.gameState = gameState;
        this.gameState.timerManager.register(this);
    }

    onTimer() {
        if (this.queue.length > 0) {
            let building = this.queue[0];
            building.remainingTime -= 1000; // assuming the TimerManager interval is 1000 ms
            if (building.remainingTime <= 0) {
                this.removeFromQueue();
            }
        }
    }

    addToQueue(building) {
        console.log(`Current queue size: ${this.queue.length}, Max queue size: ${this.maxSize}`);
        if (this.queue.length < this.maxSize) {
            building.remainingTime = building.constructionTime; // initialize remaining time
            this.queue.push(building);
            return true;
        } else {
            return false;
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