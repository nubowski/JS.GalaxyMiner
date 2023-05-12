

class BuildingQueue {
    constructor() {
        this.queue = [];
    }

    addToQueue(building) {
        this.queue.push(building);
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
}

export default BuildingQueue;