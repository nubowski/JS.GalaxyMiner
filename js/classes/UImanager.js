import createBuilding from "./buildingFactory.js";

class UImanager {
    constructor() {}

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

    generateBuildButtons(buildingData, buildingManager, buildingQueue, resources) {
        const container = document.getElementById('buttonContainer');
        for (let buildingName in buildingData) {
            let button = document.createElement('button');
            button.textContent = `Build ${buildingName}`;
            button.onclick = () => {
                let buildingInfo = JSON.parse(JSON.stringify(buildingData[buildingName])); // Deep copy
                let building = createBuilding(buildingInfo.type, buildingInfo, resources);
                buildingQueue.addToQueue(building);
            };
            container.appendChild(button);
        }
    }

    updateBuildingDisplay(buildings) {
        const container = document.getElementById('built-buildings');
        container.innerHTML = '';

        for (let building of buildings) {
            let buildingWrapper = document.createElement('div');
            buildingWrapper.classList.add('building-wrapper');

            let buildingDiv = document.createElement('div');
            buildingDiv.classList.add('built-building');
            buildingDiv.textContent = `${building.name} - Level: ${building.level}`;
            buildingWrapper.appendChild(buildingDiv);

            let upgradeButton = document.createElement('button');
            upgradeButton.textContent = `Upgrade`;
            upgradeButton.onclick = () => {
                building.upgrade();
            };
            buildingWrapper.appendChild(upgradeButton);

            container.appendChild(buildingWrapper);
        }
    }

    updateQueueDisplay(queue) {
        let queueDisplay = document.getElementById('building-queue');
        queueDisplay.innerHTML = '';
        for (let i = 0; i < queue.length; i++) {
            let building = queue[i];
            let queueItem = document.createElement('div');
            queueItem.classList.add('bqueue-item');
            queueItem.textContent = `Building: ${building.name}\nRemaining time: ${building.remainingTime}`;
            queueDisplay.appendChild(queueItem);
        }
    }

}

export default UImanager;