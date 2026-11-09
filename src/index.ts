import { State, createInitialState, startRound, applyGuess } from './state.js';
import { renderSettingsView } from './ui/settingsView.js';
import { renderGameView } from './ui/gameView.js';

let appState: State = createInitialState({ length: 4, base: 10 });

function updateState(nextState: State) {
  appState = nextState;
  renderApp();
}

function renderApp() {
  const root = document.body;
  root.replaceChildren();

  if (appState.status === 'idle') {
    const view = renderSettingsView({
      onStart: (chosenSettings) => {
        const initializedState = createInitialState(chosenSettings);
        updateState(startRound(initializedState));
      },
    });
    root.appendChild(view);
  } else {
    const view = renderGameView({
      state: appState,
      onGuess: (guess) => {
        updateState(applyGuess(appState, guess));
      },
      onRestart: () => {
        updateState(createInitialState(appState.settings));
      },
    });
    root.appendChild(view);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderApp();
});
