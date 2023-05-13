import eventBus from "../eventBus/EventBus.js";

class Resource {
    // run when a new instance of the class is created
    constructor(name, quantity) {
        this.name = name; // name of the res
        this.quantity = quantity; // current quantity of the res
    }

    addQuantity(amount) {
        this.quantity += amount;
        eventBus.emit('resourceChanged', this);
    }

    subtractQuantity(amount) {
        if (this.quantity >= amount) {
            this.quantity -= amount;
            eventBus.emit('resourceChanged', this);
            return true;
        } else {
            return false;
        }
    }

    canSubtract(amount) {
        return this.quantity >= amount;
    }
}

export default Resource;