import eventBus from "../eventBus/EventBus.js";
import resourceData from "../data/resourceData.js";

class Resource {
    // run when a new instance of the class is created
    constructor(name, quantity, resources) {
        this.name = name; // name of the res
        this.quantity = quantity; // current quantity of the res

        eventBus.on("produceResource", ({ resourceType, productionRate }) => {
            if (resourceType === this.name) {
                this.produce(productionRate);
            }
        });
    }

    addQuantity(amount) {
        this.quantity += amount;
        eventBus.emit('resourceUpdated', resourceData);
    }

    subtractQuantity(amount) {
        if (this.quantity >= amount) {
            this.quantity -= amount;
            eventBus.emit('resourceUpdated', resourceData);
            return true;
        } else {
            return false;
        }
    }

    canSubtract(amount) {
        return this.quantity >= amount;
    }

    produce(productionRate) {
        this.addQuantity(productionRate);
        eventBus.emit("resourceUpdated", resourceData);
    }
}

export default Resource;