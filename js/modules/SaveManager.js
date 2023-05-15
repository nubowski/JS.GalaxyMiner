import eventBus from "../eventBus/EventBus";

class SaveManager {
    constructor() {
        // fired when the game needs to be saved
        eventBus.on('SaveGame', (gameState) => this.saveGame(gameState));

        // fired when the game needs to be loaded
        eventBus.on('LoadGame', () => this.loadGame());
    }

    saveGame(gameState) {
        try {
            const serializedState = JSON.stringify(gameState);
            localStorage.setItem('gameState', serializedState);
        } catch (err) {
            console.error('Error saving state: ', err);
        }
    }

    loadGame() {
        try {
            const serializedState = localStorage.getItem('gameState');
            if (serializedState === null) {
                return undefined; // case with never ever huever saved
            }
            return JSON.parse(serializedState);
        } catch (err) {
            console.error('Error loading state: ', err);
        }
    }
}

export default SaveManager;