import eventBus from "../eventBus/EventBus.js";
import UITooltip from "../UI/UITooltip.js";


class UImanager {
    constructor(buildingTemplates) {
        this.tooltip = new UITooltip();
        this.buildingTemplates = buildingTemplates;
        this.createOverlay();
        eventBus.on('hoverStart', this.handleHoverStart.bind(this));
        eventBus.on('hoverEnd', this.handleHoverEnd.bind(this));
        eventBus.on('showTooltip', this.tooltip.showTooltip.bind(this.tooltip));
        eventBus.on('hideTooltip', this.tooltip.hideTooltip.bind(this.tooltip));
        eventBus.on('tabClicked', (tabId) => this.changeActiveTab(tabId));
        eventBus.on('resourceUpdated', (resources) => this.updateResourceDisplay(resources));
        eventBus.on('buildingSpaceUpdated', (buildingManager) => this.updateSpaceDisplay(buildingManager));
        eventBus.on('buildingUpdated', (buildings) => this.updateBuildingDisplay(buildings));
        eventBus.on('updateQueueDisplay', (queue) => this.updateQueueDisplay(queue));
        eventBus.on('updateDisplay', ({resources, buildingManager}) => this.updateDisplay(resources, buildingManager));
        eventBus.on('createBuildButtons', () => this.generateBuildingButtons());
        eventBus.on('createDebugButtons', () => this.generateDebugButtons());
        eventBus.on('gameLoaded', (gameState) => {
            this.updateBuildingDisplay(gameState.buildings);
            this.updateResourceDisplay(gameState.resources);
            this.updateSpaceDisplay(gameState.buildingManager);
        });
    }

    handleHoverStart({e, tooltipContent}) {
        this.tooltipTimer = setTimeout(() => {
            eventBus.emit('showTooltip', {event: e, content: tooltipContent});
        }, 1000); // Display the tooltip after 1 second
    }

    handleHoverEnd() {
        clearTimeout(this.tooltipTimer); // Cancel the tooltip if the mouse leaves before 1 second
    }

    createOverlay() {
        const container = document.getElementById('start-button-container');

        // Create the overlay
        const overlay = document.createElement('div');
        overlay.id = 'overlay';
        overlay.classList.add('overlay');

        // Create the button container
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        // Create the start/continue button
        const startButton = document.createElement('button');
        startButton.id = 'start-continue-button';
        startButton.textContent = 'Start Game'; // Modify the text based on the game state
        buttonContainer.appendChild(startButton);

        overlay.appendChild(buttonContainer);
        container.appendChild(overlay);

        // Prevent clicks on the overlay from propagating to underlying elements
        overlay.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }


    generateBuildingButtons() {
        const tabContainer = document.getElementById('building-tab-content');

        // Create a unique container for building content
        const container = document.createElement('div');
        container.className = 'building-content-wrapper';

        for (let buildingTemplate of this.buildingTemplates) {
            let buildingItem = document.createElement('div');
            buildingItem.className = 'build-item';
            container.appendChild(buildingItem);  // building items to the unique container

            let buildButtonContentContainer = document.createElement('div');
            buildButtonContentContainer.className = 'build-button-content-container';
            buildingItem.appendChild(buildButtonContentContainer);

            let buildingName = document.createElement('p');
            buildingName.textContent = buildingTemplate.name;
            buildButtonContentContainer.appendChild(buildingName);

            let buildButtonContainer = document.createElement('div');
            buildButtonContainer.className = 'build-button-container';
            buildingItem.appendChild(buildButtonContainer);

            let buildButton = document.createElement('button');
            buildButton.id = `build-${buildingTemplate.name}`;  // give the button a unique id
            buildButton.className = 'build-button';  // add a class for styling
            buildButton.textContent = `Build`;
            buildButtonContainer.appendChild(buildButton);

            // background img added
            let imageElement = document.createElement('img');
            imageElement.className = 'build-item-image';
            let imageName = buildingTemplate.name.replace(/ /g, ''); // kill spaces
            imageElement.src = `assets/images/buildings/${imageName}Icon.jpg`;
            buildButtonContentContainer.appendChild(imageElement);


        }

        // unique container to the tab
        tabContainer.appendChild(container);
    }

    generateDebugButtons () {
        const container = document.getElementById('debug-button-container')
        // Create a reset button
        let resetButton = document.createElement('button');
        resetButton.id = 'reset-game';  // give the button a unique id
        resetButton.textContent = 'Reset Game';
        container.appendChild(resetButton);
    }


    updateResourceDisplay(resources) {
        const resourcesContent = document.getElementById('resources-content');

        for (let resource of resources) {
            let resourceDisplay = document.getElementById(`${resource.name}Display`);
            if (!resourceDisplay) {
                resourceDisplay = document.createElement('div');
                resourceDisplay.id = `${resource.name}Display`;
                resourcesContent.appendChild(resourceDisplay); // Append to the resources content
            }
            resourceDisplay.innerHTML = `${resource.name}: ${resource.quantity}`;
        }
    }

    updateSpaceDisplay(buildingManager) {
        const spaceContent = document.getElementById('spaces-content');
        let spaceDisplay = document.getElementById('spaceDisplay');
        if (!spaceDisplay) {
            spaceDisplay = document.createElement('div');
            spaceDisplay.id ='spaceDisplay';
            spaceContent.appendChild(spaceDisplay);
        }
        spaceDisplay.innerHTML = `Space used: ${buildingManager.usedSpaces} / ${buildingManager.maxSpaces}`;

        // Update the progress bar
        let spaceProgressBar = document.getElementById('empty-spaces-bar');
        spaceProgressBar.value = buildingManager.usedSpaces;
        spaceProgressBar.max = buildingManager.maxSpaces;

        // Determine the color based on the percentage of used space
        let percentUsed = (buildingManager.usedSpaces / buildingManager.maxSpaces) * 100;

        if (percentUsed <= 30) {
            spaceProgressBar.className = 'progress-green';
        } else if (percentUsed <= 80) {
            spaceProgressBar.className = 'progress-yellow';
        } else {
            spaceProgressBar.className = 'progress-red';
        }
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

    changeActiveTab(tabId) {
        // Get all tab contents
        const tabs = document.getElementsByClassName('tab-content');

        // Hide all tabs
        for(let i = 0; i < tabs.length; i++) {
            tabs[i].classList.remove('active');
        }

        // Show the selected tab
        document.getElementById(tabId).classList.add('active');
    }

}

export default UImanager;