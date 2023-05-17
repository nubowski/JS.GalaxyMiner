import eventBus from "../eventBus/EventBus.js";

class GameStateManager {
    constructor(resourceInstances, buildingManager) {
        this.resourceInstances = resourceInstances;
        this.buildingManager = buildingManager;

        eventBus.on('getGameState', this.returnGameState.bind(this));
        eventBus.on('setGameState', this.setGameState.bind(this));
    }

    returnGameState(){
        let gameState = this.getGameState();
        eventBus.emit('returnGameState', gameState);
    }

    getGameState() {
        console.log('GameStateManager, getGameState method');
        let gameState = {};

        // save resources
        gameState.resources = this.resourceInstances.map(resource => ({
            name: resource.name,
            quantity: resource.quantity,
        }));

        // save building
        gameState.buildings = this.buildingManager.getBuiltBuildings().map(building => ({
            id: building.id,
            name: building.name,
            type: building.type,
            space: building.space,
            level: building.level,
            constructionTime: building.constructionTime,
            remainingTime: building.remainingTime,
            resourceType: building.resourceType,
            productionRate: building.productionRate,
            cost: building.cost,
            underConstruction: building.underConstruction,
            isUpgrade: building.isUpgrade,
        }));

        // save building queue
        gameState.queue = this.buildingManager.getQueue().map(building => building.id);

        console.log('GameStateManager, getGameState, gameState:', gameState);


        return gameState;
    }

    setGameState(loadedState) {

        // Set resources
        for (let resource of loadedState.resources) {
            // Find the corresponding resource instance and set its quantity
            let resourceInstance = this.resourceInstances.find(ri => ri.name === resource.name);
            if (resourceInstance) {
                resourceInstance.quantity = resource.quantity;
            } else {
                // If the resource instance is not found, create a new one
                let newResourceInstance = new Resource(resource.name, resource.quantity);
                this.resourceInstances.push(newResourceInstance);
            }
        }

        // Clear current buildings
        this.buildingManager.clearBuildings();

        // Restore buildings
        eventBus.emit('requestCreateBuildings', {buildingsData: loadedState.buildings, gameState: loadedState});

        // Clear the building queue first
        this.buildingManager.queue = [];
        // Add buildings to queue based on their ids
        for (let id of loadedState.queue) {
            let building = this.buildingManager.getBuiltBuildings().find(building => building.id === id);
            if (building) {
                this.buildingManager.addToQueue(building);
            }
        }
        eventBus.emit('gameLoaded', loadedState); // Include the entire game state
        console.log('Game state set');
    }

}

export default GameStateManager;