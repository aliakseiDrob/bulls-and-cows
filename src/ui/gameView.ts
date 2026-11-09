import { State } from '../state.js';
import { createDigitValidator } from '../createDigitalValidator.js';

interface GameViewProps {
  state: State;
  onGuess: (guess: string) => void;
  onRestart: () => void;
}

export function renderGameView({ state, onGuess, onRestart }: GameViewProps): HTMLElement {
  const container = document.createElement('div');
  container.className = 'game-screen';

  const info = document.createElement('p');
  info.textContent = `Режим: Длина ${state.settings.length}, База ${state.settings.base}`;
  container.appendChild(info);

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = `Введите ${state.settings.length} уник. символов`;
  input.maxLength = state.settings.length;

  const isCharValid = createDigitValidator(state.settings.base);
  input.addEventListener('keypress', (e) => {
    if (!isCharValid(e.key)) {
      e.preventDefault();
    }
  });

  container.appendChild(input);

  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'Проверить';

  const handleSubmission = () => {
    if (input.value.trim()) {
      onGuess(input.value.trim());
      input.value = '';
      input.focus();
    }
  };

  submitBtn.addEventListener('click', handleSubmission);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSubmission();
  });

  container.appendChild(submitBtn);

  const backBtn = document.createElement('button');
  backBtn.textContent = 'В меню настроек';
  backBtn.addEventListener('click', onRestart);
  container.appendChild(backBtn);

  if (state.history.length > 0) {
    const table = document.createElement('table');
    table.className = 'history-table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['№', 'Попытка', 'Быки', 'Коровы'].forEach((text) => {
      const th = document.createElement('th');
      th.textContent = text;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    state.history.forEach((entry, idx) => {
      const row = document.createElement('tr');

      const numCell = document.createElement('td');
      numCell.textContent = (idx + 1).toString();

      const guessCell = document.createElement('td');
      guessCell.textContent = entry.guess.toUpperCase();

      const bullsCell = document.createElement('td');
      bullsCell.textContent = entry.bulls.toString();

      const cowsCell = document.createElement('td');
      cowsCell.textContent = entry.cows.toString();

      row.append(numCell, guessCell, bullsCell, cowsCell);
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    container.appendChild(table);
  }

  if (state.status === 'won') {
    const winModal = document.createElement('div');
    winModal.className = 'win-modal';

    const winTitle = document.createElement('h2');
    winTitle.textContent = '🎉 Победа!';

    const winDetails = document.createElement('p');
    const duration = Math.floor((Date.now() - state.startTime) / 1000);
    winDetails.textContent = `Вы угадали число ${state.secret.toUpperCase()} за ${state.history.length} попыток и ${duration} сек.!`;

    const newGameBtn = document.createElement('button');
    newGameBtn.textContent = 'Играть снова';
    newGameBtn.addEventListener('click', onRestart);

    winModal.append(winTitle, winDetails, newGameBtn);
    container.appendChild(winModal);

    input.disabled = true;
    submitBtn.disabled = true;
  }

  return container;
}
