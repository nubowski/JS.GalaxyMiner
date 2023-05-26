import eventBus from "../eventBus/EventBus.js";
import Building from "./Building.js"; // TODO move it away or make a hybrid game state - event system

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

        // TODO re-fucktor as hell. And make ONE DATA to rule`em all

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
            currentBuildingId: Building.idCounter,
        }));
        // save building queue
        gameState.queue = this.buildingManager.getQueue().map(building => ({
            type: building.type,
            id: building.id,
            name: building.name,
            level: building.level,
            isUpgrade: building.isUpgrade,
            remainingTime: building.remainingTime,
            underConstruction: building.underConstruction,
        }));

        return gameState;
    }

    setGameState(loadedState) {
        console.log('Loaded State: ', loadedState);
        console.log('Loaded Buildings: ', loadedState.buildings);


        // events to set resources, buildings and queue
        eventBus.emit('setBuildingID', loadedState.currentBuildingId);
        eventBus.emit('setResources', loadedState.resources);
        eventBus.emit('clearBuildings');
        eventBus.emit('restoreBuildings', loadedState);

        eventBus.on('buildingManagerRestored', () => {
            eventBus.emit('gameLoaded', this.getGameState());
        });
        console.log('Game state set');
    }
}

export default GameStateManager;
