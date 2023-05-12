
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

    generateBuildButtons(producers, buildingManager) {
        const container = document.getElementById('buttonContainer');
        for (let producer of producers) {
            let button = document.createElement('button');
            button.textContent = `Build ${producer.name}`;
            button.onclick = () => {
                producer.build(buildingManager);
            }
            container.appendChild(button);
        }
    }

    updateBuildingDisplay (buildings) {
        const container = document.getElementById('buildings-container');
        container.innerHTML = '';

        for (let building of buildings) {
            let buildingDiv = document.createElement('div');
            let upgradeButton = document.createElement('button');

            upgradeButton.textContent = `Upgrade ${building.name}`;
            upgradeButton.onclick = () => {
                building.upgrade();
            }

            buildingDiv.textContent = `${building.name} - Level: ${building.level}`;
            buildingDiv.appendChild(upgradeButton);

            container.appendChild(buildingDiv);
        }
    }

    updateQueueDisplay(queue) {
        let queueDisplay = document.getElementById('queueDisplay');
        if (!queueDisplay) {
            queueDisplay = document.createElement('div');
            queueDisplay.id ='queueDisplay';
            document.body.appendChild(queueDisplay);
        }
        queueDisplay.innerHTML = '';
        for (let i = 0; i < queue.length; i++) {
            let building = queue[i];
            queueDisplay.innerHTML += `Building: ${building.name} - Remaining time: ${building.remainingTime}<br>`;
        }
    }

}

export default UImanager;