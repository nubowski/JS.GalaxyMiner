import eventBus from "../eventBus/EventBus.js";

class GameStateManager {
    constructor(resourceManager, buildingManager) {
        this.resourceManager = resourceManager;
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
        gameState.resources = this.resourceManager.getResourceData();

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
        // events to set resources, buildings and queue
        eventBus.emit('setResources', loadedState.resources);
        eventBus.emit('clearBuilding');
        eventBus.emit('setBuildings', loadedState.buildings);
        eventBus.emit('setBuildingQueue', loadedState.queue);

        eventBus.emit('gameLoaded', loadedState); // the entire game state
        console.log('Game state set');
    }
}

export default GameStateManager;
