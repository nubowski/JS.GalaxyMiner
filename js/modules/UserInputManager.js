import eventBus from "../eventBus/EventBus.js";

class UserInputManager {
    constructor() {


        eventBus.on('onClickListener', (buildingTemplates) => this.attachEventHandlers(buildingTemplates));
        eventBus.on('upgradeButtonCreated', ({buttonId, buildings}) => this.attachUpgradeEventHandler(buttonId, buildings));
    }

    attachEventHandlers(buildingTemplates) {
        for (let buildingTemplate of buildingTemplates) {
            let buildButton = document.getElementById(`build-${buildingTemplate.name}`);
            buildButton.onclick = () => {
                eventBus.emit('attemptToBuild', buildingTemplate);
            };
        }
    }

    attachUpgradeEventHandler(buttonId, buildings) {
        let upgradeButton = document.getElementById(buttonId);
        upgradeButton.onclick = () => {
            let building = buildings.find(b => `upgrade-${b.name}-${b.id}` === buttonId);
            eventBus.emit('attemptToUpgrade', {buildingID: building.id, buildings: buildings});
        };
    }
}

export default UserInputManager;