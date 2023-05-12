import {MAX_BUILDING_SPACE} from "./constants.js";
import {DEFAULT_BUILDING_LEVEL} from "./constants.js";

class BuildingManager {
    constructor(maxSpaces = MAX_BUILDING_SPACE) {
        this.maxSpaces = maxSpaces;
        this.usedSpaces = 0;
        this.reservedSpaces = 0;
        this.buildings = [];
        this.constructionQueue = [];
        this.builtBuildings = [];
        this.currentBuilding = null;
        this.buildingTimer = null;
    }

    setGameState(gameState) {
        this.gameState = gameState;
    }

    getBuiltBuildings() {
        return this.builtBuildings;
    }

    getCurrentBuilding() {
        return this.currentBuilding;
    }

    canBuild(building) {
        return (this.usedSpaces + this.reservedSpaces + building.space) <= this.maxSpaces;
    }


    addBuilding(building, initialLevel = DEFAULT_BUILDING_LEVEL) {
        if (building === null) {
            console.log("addBuilding: building is NULL")
            return false;
        }
        this.buildings.push(building);
        this.builtBuildings.push(building);
        this.usedSpaces += building.space;
        this.reservedSpaces -= building.space;
        building.setLevel(initialLevel);
        this.gameState.uiManager.updateBuildingDisplay(this.getBuiltBuildings());

        if (this.currentBuilding === null && this.constructionQueue.length > 0) {
            this.currentBuilding = this.constructionQueue.shift();
        }

        return true;
    }

    // Remove startBuilding(), reserveSpace(), queueBuilding(), buildNextInQueue() - these are handled by Building and BuildingQueue

    hasSufficientSpace(building) {
        return this.canBuild(building);
    }

    removeBuilding(building) {
        const index = this.buildings.indexOf(building);
        if (index > -1) {
            this.buildings.splice(index, 1);
            this.usedSpaces -= building.space;
            return true;
        }
        return false;
    }
}

export default BuildingManager;