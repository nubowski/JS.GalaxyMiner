import Resource from "./Resource.js";
import eventBus from "../eventBus/EventBus.js";

class ResourceManager {
    constructor() {
        this.resourceInstances = [];

        eventBus.on('createResource', this.createResource.bind(this));
        eventBus.on('updateResource', this.updateResource.bind(this));
        eventBus.on("produceResource", this.produceResource.bind(this));
    }

    getResourceByName(resourceType) {
        return this.resourceInstances.find(res => res.name === resourceType);
    }

    produceResource ({resourceType, productionRate}) {
        let resource = this.getResourceByName(resourceType);
        if (resource) {
            resource.quantity += productionRate;
            this.emitResourceUpdate();
        }
    }

    createResource (resourceData) {
        let resource = new Resource(resourceData.name, resourceData.quantity);
        this.resourceInstances.push(resource);
        this.emitResourceUpdate();
    }

    updateResource (name, quantity) {
        let resource = this.getResourceByName(name);
        if (resource) {
            resource.quantity = quantity;
            this.emitResourceUpdate();
        }
    }

    addQuantity(resourceType, amount) {
        let resource = this.getResourceByName(resourceType);
        if (resource) {
            resource.quantity += amount;
            this.emitResourceUpdate();
        }
    }

    subtractQuantity(resourceType, amount) {
        let resource = this.getResourceByName(resourceType);
        if (resource && resource.quantity >= amount) {
            resource.quantity -= amount;
            this.emitResourceUpdate();
            return true;
        } else {
            return false;
        }
    }

    canSubtract(resourceType, amount) {
        let resource = this.getResourceByName(resourceType);
        return resource && resource.quantity >= amount;
    }

    emitResourceUpdate() {
        eventBus.emit('resourceUpdated', this.getResourceData());
    }

    getResourceData() {
        return this.resourceInstances.map(resource => ({
            name: resource.name,
            quantity: resource.quantity,
        }));
    }
}

export default ResourceManager;