import eventBus from "../eventBus/EventBus.js";

class SaveManager {
    constructor() {
        eventBus.on('timerTick', () => this.saveGame());
        eventBus.on('SaveGame', () => this.saveGame());
        eventBus.on('LoadGame', () => this.loadGame());
        eventBus.on('ResetGame', () => this.resetGame());
        eventBus.on('returnGameState', (gameState) => this.prepareGameState(gameState));
    }

    saveGame() {
        console.log('SaveGame event emitted');
        eventBus.emit('getGameState');
    }

    prepareGameState (gameState) {
        try {
            const serializedState = JSON.stringify(gameState);
            localStorage.setItem('gameState', serializedState);
        } catch (err) {
            console.error('Error saving state: ', err);
        }
    }

    loadGame() {
        console.log('LoadGame event received');
        try {
            const serializedState = localStorage.getItem('gameState');
            if (serializedState === null) {
                eventBus.emit('newGame');
            } else {
                let restoredGame = JSON.parse(serializedState);
                eventBus.emit('setGameState', restoredGame);
            }
        } catch (err) {
            console.error('Error loading state: ', err);
            eventBus.emit('newGame');
        }
    }

    resetGame() {
        localStorage.removeItem('gameState');
    }
}

export default SaveManager;