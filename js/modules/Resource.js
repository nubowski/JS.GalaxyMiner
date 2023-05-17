import eventBus from "../eventBus/EventBus.js";
import resourceData from "../data/resourceData.js";

class Resource {
    constructor(name, quantity, resources) {
        this.name = name;
        this.quantity = quantity;

        eventBus.on("produceResource", ({ resourceType, productionRate }) => {
            if (resourceType === this.name) {
                this.produce(productionRate);
            }
        });
    }
}

export default Resource;