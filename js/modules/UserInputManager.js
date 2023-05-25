import eventBus from "../eventBus/EventBus.js";

class UserInputManager {
    constructor() {


        eventBus.on('onClickListener', (buildingTemplates) => this.attachEventHandlers(buildingTemplates));
        eventBus.on('upgradeButtonCreated', ({buttonId, buildings}) => this.attachUpgradeEventHandler(buttonId, buildings));
        eventBus.on('buildingAdded', ({templates}) => this.attachEventHandlers(templates));
    }

    handleGameLoaded(gameState) {
        const overlay = document.getElementById('overlay');
        const startButton = document.getElementById('start-continue-button');

        if (gameState) {
            // Game is loaded, hide the overlay and enable the continue button
            overlay.style.display = 'none';
            startButton.textContent = 'Continue Game';
            startButton.disabled = false;
        } else {
            // No game loaded, show the overlay and enable the start button
            overlay.style.display = 'flex';
            startButton.textContent = 'Start Game';
            startButton.disabled = false;
        }
    }

    attachEventHandlers(buildingTemplates) {
        for (let buildingTemplate of buildingTemplates) {
            let buildButton = document.getElementById(`build-${buildingTemplate.name}`);
            buildButton.onclick = () => {
                eventBus.emit('attemptToBuild', buildingTemplate);
            };
        }

        let startContinueButton = document.getElementById('start-continue-button');
        startContinueButton.onclick = () => {
            eventBus.emit('StartContinueGame');
        };

        let resetButton = document.getElementById('reset-game');
        resetButton.onclick = () => {
            eventBus.emit('ResetGame');
        };
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