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
        eventBus.emit('getGameState');
    }

    prepareGameState (gameState) {
        console.log('SaveManager, prepareGameState, gameState:', gameState);
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
        location.reload();
    }
}

export default SaveManager;