import {DEFAULT_QUEUE_SIZE} from "./constants.js";

class BuildingQueue {
    constructor(maxSize = DEFAULT_QUEUE_SIZE) {
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
            building.remainingTime -= this.gameState.timerManager.tickInterval;

            if (building.remainingTime <= 0) {
                this.removeFromQueue();
            }
        }
    }

    canAddToQueue(building) {
        return this.queue.length < this.maxSize && this.gameState.buildingManager.canReserveSpace(building);
    }

    addToQueue(building) {
        if (this.canAddToQueue(building)) {
            building.remainingTime = building.constructionTime; // initialize remaining time
            this.queue.push(building);
            this.gameState.buildingManager.reserveSpace(building);
            this.gameState.uiManager.updateQueueDisplay(this.queue);
            return true;
        } else {
            return false;
        }
    }

    removeFromQueue () {
        if (this.queue.length > 0) {
            let building = this.queue.shift();
            // Pass the completed building to the BuildingManager
            this.gameState.buildingManager.addBuilding(building);
            this.gameState.uiManager.updateQueueDisplay(this.queue);
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