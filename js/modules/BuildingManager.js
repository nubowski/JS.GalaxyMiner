import eventBus from '../eventBus/EventBus.js';
import {MAX_BUILDING_SPACE, DEFAULT_BUILDING_LEVEL} from "../data/constants.js";

class BuildingManager {
    constructor(maxSpaces = MAX_BUILDING_SPACE) {
        this.maxSpaces = maxSpaces;
        this.usedSpaces = 0;
        this.reservedSpaces = 0;
        this.buildings = [];
        this.builtBuildings = [];

        eventBus.on('buildingConstructed', (building) => this.addBuilding(building));
        eventBus.on('startBuilding', () => this.startBuilding());
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
        eventBus.emit('buildingUpdated', this.getBuiltBuildings());
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
        eventBus.emit('startBuilding');
    }
}

export default BuildingManager;