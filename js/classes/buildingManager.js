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
    }

    getBuiltBuildings() {
        return this.builtBuildings;
    }

    canBuild(building) {
        return (this.usedSpaces + this.reservedSpaces + building.space) <= this.maxSpaces;
    }

    reserveSpace(building) {
        if (this.canBuild(building)) {
            this.reservedSpaces += building.space;
            return true;
        }
        return false;
    }

    addBuilding(building, initialLevel = DEFAULT_BUILDING_LEVEL) {
        if (this.reserveSpace(building)) {
            this.buildings.push(building);
            this.builtBuildings.push(building);
            this.usedSpaces += building.space;
            this.reservedSpaces -= building.space;
            building.setLevel(initialLevel);
            return true;
        } else {
            this.queueBuilding(building);
            return false;
        }
    }

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

    queueBuilding(building) {
        this.constructionQueue.push(building);
    }

    buildNextInQueue() {
        if (this.constructionQueue.length > 0) {
            const nextBuilding = this.constructionQueue[0];
            if (this.addBuilding((nextBuilding))) {
                this.constructionQueue.shift();
            }
        }
    }
}

export default BuildingManager;