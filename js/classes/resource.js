class Resource {
     // run when a new instance of the class is created
    constructor(name, quantity) {
        this.name = name; // name of the res
        this.quantity = quantity; // current quantity of the res
    }

    addQuantity(amount) {
        this.quantity += amount;
    }

    subtractQuantity(amount) {
        if (this.quantity >= amount) {
            this.quantity -= amount;
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