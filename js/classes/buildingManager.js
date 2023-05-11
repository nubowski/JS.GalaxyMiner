import {MAX_BUILDING_SPACE} from "./constants";

class BuildingManager {
    constructor(maxSpaces = MAX_BUILDING_SPACE) {
        this.maxSpaces = maxSpaces;
        this.usedSpaces = 0;
        this.reservedSpaces = 0;
        this.buildings = [];
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

    addBuilding(building) {
        if (this.reserveSpace(building)) {
            this.buildings.push(building);
            this.usedSpaces += building.space;
            this.reservedSpaces -= building.space;
            return true;
        }
        return false;
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