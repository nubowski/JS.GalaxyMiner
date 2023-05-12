
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
}

export default UImanager;