import eventBus from "../eventBus/EventBus.js";

class UserInputManager {
    constructor(buildingData) {
        this.buildingData = buildingData;

        this.generateBuildingButtons();
    }

    generateBuildingButtons() {
        const container = document.getElementById('buttonContainer');
        for (let buildingName in this.buildingData) {
            let button = document.createElement('button');
            button.textContent = `Build ${buildingName}`;
            button.onclick = () => {
                let buildingInfo = JSON.parse(JSON.stringify(this.buildingData[buildingName])); // Deep copy. To kill later on
                eventBus.emit('createBuilding', buildingInfo);
            };
            container.appendChild(button);
        }
    }
}

export default UserInputManager;