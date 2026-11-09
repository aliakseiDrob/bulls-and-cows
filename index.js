import { createInitialState, startRound, applyGuess, toggleLeaderboard } from './state.js';
import { renderSettingsView } from './ui/settingsView.js';
import { renderGameView } from './ui/gameView.js';
import { renderLeaderboardView } from './ui/leaderboardView.js';
import { loadScores, saveNewScore } from './scoreService.js';
let appState = createInitialState({ length: 4, base: 10 });
function updateState(nextState) {
    appState = nextState;
    renderApp();
}
function renderApp() {
    const root = document.body;
    root.replaceChildren();
    if (appState.status === 'idle') {
        const settingsView = renderSettingsView({
            isLeaderboardVisible: appState.showLeaderboard,
            onStart: (chosenSettings) => {
                const initializedState = createInitialState(chosenSettings);
                updateState(startRound(initializedState));
            },
            onToggleLeaderboard: () => {
                updateState(toggleLeaderboard(appState));
            },
        });
        root.appendChild(settingsView);
        if (appState.showLeaderboard) {
            const overlay = document.createElement('div');
            overlay.className = 'leaderboard-overlay';
            const modal = document.createElement('div');
            modal.className = 'leaderboard-modal';
            const leaderboardView = renderLeaderboardView({ scores: loadScores() });
            modal.appendChild(leaderboardView);
            const closeBtn = document.createElement('button');
            closeBtn.textContent = 'Закрыть';
            closeBtn.addEventListener('click', () => {
                updateState(toggleLeaderboard(appState));
            });
            modal.appendChild(closeBtn);
            overlay.appendChild(modal);
            root.appendChild(overlay);
        }
    }
    else {
        const gameView = renderGameView({
            state: appState,
            onGuess: (guess) => {
                updateState(applyGuess(appState, guess));
            },
            onRestart: () => {
                updateState(createInitialState(appState.settings));
            },
            onSaveScore: (name, attempts, duration) => {
                const currentScores = loadScores();
                saveNewScore(currentScores, {
                    name,
                    attempts,
                    duration,
                    settings: appState.settings,
                });
            },
        });
        root.appendChild(gameView);
        if (appState.status === 'won') {
            const currentScores = loadScores();
            const leaderboardView = renderLeaderboardView({ scores: currentScores });
            root.appendChild(leaderboardView);
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    renderApp();
});
