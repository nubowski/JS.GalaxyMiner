import eventBus from "../eventBus/EventBus.js";

class UserInputManager {
    constructor(buildingTemplates) {
        this.buildingTemplates = buildingTemplates;

        this.generateBuildingButtons();
    }

    generateBuildingButtons() {
        const container = document.getElementById('buttonContainer');
        for (let {name: buildingName} of this.buildingTemplates) {
            let button = document.createElement('button');
            button.textContent = `Build ${buildingName}`;
            button.onclick = () => {
                let buildingInfo = this.buildingTemplates.find(template => template.name === buildingName);
                eventBus.emit('attemptToBuild', buildingInfo);
            };
            container.appendChild(button);
        }
    }
}

export default UserInputManager;