import eventBus from "../eventBus/EventBus.js";
import building from "./Building.js";

class UserInputManager {
    constructor(buildingTemplates) {
        this.buildingTemplates = buildingTemplates;

        this.generateBuildingButtons();
    }

    generateBuildingButtons() {
        const container = document.getElementById('buttonContainer');
        for (let buildingName in this.buildingTemplates) {
            let button = document.createElement('button');
            button.textContent = `Build ${buildingName}`;
            button.onclick = () => {
                let buildingTemplate = this.buildingTemplates[buildingName];
                let buildingInfo = JSON.parse(JSON.stringify(buildingTemplate)); // Deep copy
                eventBus.emit('createBuilding', buildingInfo);
            };
            container.appendChild(button);
        }
    }
}

export default UserInputManager;