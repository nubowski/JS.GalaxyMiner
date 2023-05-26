import eventBus from "../eventBus/EventBus.js";

class UserInputManager {
    constructor() {
        this.tooltipTimer = null;


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
            console.log('description: ', buildingTemplate.description);
            buildButton.onclick = () => {
                eventBus.emit('attemptToBuild', buildingTemplate);
            };
            // TODO unification of these info
            buildButton.addEventListener('mouseenter', (e) => {
                eventBus.emit('hoverStart', {e, tooltipContent: buildingTemplate.description});
            });
            buildButton.addEventListener('mouseleave', () => {
                eventBus.emit('hoverEnd');
                eventBus.emit('hideTooltip');
            });
        }

        let startContinueButton = document.getElementById('start-continue-button');
        startContinueButton.onclick = () => {
            eventBus.emit('StartContinueGame');
        };

        let resetButton = document.getElementById('reset-game');
        resetButton.onclick = () => {
            eventBus.emit('ResetGame');
        };

        document.getElementById('research-tab').addEventListener('click', () => eventBus.emit('tabClicked', "research-tab-content"));
        document.getElementById('building-tab').addEventListener('click', () => eventBus.emit('tabClicked', "building-tab-content"));
        document.getElementById('achievements-tab').addEventListener('click', () => eventBus.emit('tabClicked', "achievements-tab-content"));
        document.getElementById('settings-tab').addEventListener('click', () => eventBus.emit('tabClicked', "settings-tab-content"));
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