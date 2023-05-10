 class Resource {
     // constructor is a special method that is run when a new instance of the class is created
    constructor(name, quantity, productionRate) {
        this.name = name; // name of the res
        this.quantity = quantity; // current quantity of the res
        this.productionRate = productionRate; // rate produced per second
    }

    // method to update the quantity of the res based on its prod rate
     updateQuantity(seconds) {
        this.quantity += this.productionRate * seconds;
     }
 }

 export default Resource;