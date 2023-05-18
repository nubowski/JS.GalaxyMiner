import eventBus from "../eventBus/EventBus.js";


class UImanager {
    constructor(buildingTemplates) {
        this.buildingTemplates = buildingTemplates;
        eventBus.on('resourceUpdated', (resources) => this.updateResourceDisplay(resources));
        eventBus.on('buildingSpaceUpdated', (buildingManager) => this.updateSpaceDisplay(buildingManager));
        eventBus.on('buildingUpdated', (buildings) => this.updateBuildingDisplay(buildings));
        eventBus.on('updateQueueDisplay', (queue) => this.updateQueueDisplay(queue));
        eventBus.on('updateDisplay', ({resources, buildingManager}) => this.updateDisplay(resources, buildingManager));
        eventBus.on('createBuildButtons', () => this.generateBuildingButtons());
        eventBus.on('gameLoaded', (gameState) => {
            this.updateBuildingDisplay(gameState.buildings);
            this.updateResourceDisplay(gameState.resources);
            this.updateSpaceDisplay(gameState.buildingManager);
        });
    }

    generateBuildingButtons() {
        const container = document.getElementById('buttonContainer');

        for (let buildingTemplate of this.buildingTemplates) {
            let buildButton = document.createElement('button');
            buildButton.id = `build-${buildingTemplate.name}`;  // give the button a unique id
            buildButton.textContent = `Build ${buildingTemplate.name}`;
            container.appendChild(buildButton);
        }

        // Create a reset button
        let resetButton = document.createElement('button');
        resetButton.id = 'reset-game';  // give the button a unique id
        resetButton.textContent = 'Reset Game';
        container.appendChild(resetButton);
    }

    updateResourceDisplay(resources) {
        for (let resource of resources) {
            let resourceDisplay = document.getElementById(`${resource.name}Display`);
            if (!resourceDisplay) {
                resourceDisplay = document.createElement('div');
                resourceDisplay.id = `${resource.name}Display`;
                document.body.appendChild(resourceDisplay);
            }
            resourceDisplay.innerHTML = `${resource.name}: ${resource.quantity}`;
        }
    }

    updateSpaceDisplay(buildingManager) {
        let spaceDisplay = document.getElementById('spaceDisplay');
        if (!spaceDisplay) {
            spaceDisplay = document.createElement('div');
            spaceDisplay.id ='spaceDisplay';
            document.body.appendChild(spaceDisplay);
        }
        spaceDisplay.innerHTML = `Space used: ${buildingManager.usedSpaces} / ${buildingManager.maxSpaces}`;
    }

    updateDisplay(resources, buildingManager) {
        this.updateResourceDisplay(resources);
        this.updateSpaceDisplay(buildingManager);
    }

    updateBuildingDisplay(buildings) {
        const container = document.getElementById('built-buildings');
        container.innerHTML = '';

        for (let building of buildings) {
            let buildingWrapper = document.createElement('div');
            buildingWrapper.classList.add('building-wrapper');

            let buildingDiv = document.createElement('div');
            buildingDiv.classList.add('built-building');
            buildingDiv.textContent = `${building.name} - Level: ${building.level}, ID: ${building.id}`;
            buildingWrapper.appendChild(buildingDiv);

            // Create and append upgrade button
            let upgradeButton = document.createElement('button');
            upgradeButton.id = `upgrade-${building.name}-${building.id}`; // give the button a unique id
            upgradeButton.textContent = `Upgrade`;
            buildingWrapper.appendChild(upgradeButton);

            container.appendChild(buildingWrapper);

            eventBus.emit('upgradeButtonCreated', {buttonId: upgradeButton.id, buildings: buildings});
        }
    }

    updateQueueDisplay(queue) {
        let queueDisplay = document.getElementById('building-queue');
        queueDisplay.innerHTML = '';
        for (let i = 0; i < queue.length; i++) {
            let building = queue[i];
            let queueItem = document.createElement('div');
            queueItem.classList.add('bqueue-item');
            queueItem.textContent = `Building: ${building.name}\nRemaining time: ${building.remainingTime / 1000}`;
            queueDisplay.appendChild(queueItem);
        }
    }

}

export default UImanager;