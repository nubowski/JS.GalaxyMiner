import {MAX_BUILDING_SPACE, DEFAULT_BUILDING_LEVEL} from "../data/constants.js";

class BuildingManager {
    constructor(maxSpaces = MAX_BUILDING_SPACE) {
        this.maxSpaces = maxSpaces;
        this.usedSpaces = 0;
        this.reservedSpaces = 0;
        this.buildings = [];
        this.builtBuildings = [];
    }

    setGameState(gameState) {
        this.gameState = gameState;
    }

    getBuiltBuildings() {
        return this.builtBuildings;
    }

    canReserveSpace(building) {
        return (this.usedSpaces + this.reservedSpaces + building.space) <= this.maxSpaces;
    }

    reserveSpace(building) {
        if (this.canReserveSpace(building)) {
            this.reservedSpaces += building.space;
            return true;
        }
        return false;
    }


    addBuilding(building, initialLevel = DEFAULT_BUILDING_LEVEL) {
        this.buildings.push(building);
        this.builtBuildings.push(building);
        this.usedSpaces += building.space;
        this.reservedSpaces -= building.space;
        building.setLevel(initialLevel);
        this.gameState.uiManager.updateBuildingDisplay(this.getBuiltBuildings());
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

    startBuilding () {
        let building = this.gameState.buildingQueue.getNextBuilding();
        if (building) {
            building.startBuilding();
            this.gameState.uiManager.updateQueueDisplay(this.gameState.buildingQueue.getQueue());
        }
    }
 }

export default BuildingManager;