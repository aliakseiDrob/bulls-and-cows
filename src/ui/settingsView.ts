import { Settings } from '../state.js';
import { countPossibleSecrets } from '../countPossibleSecrets.js';

interface SettingsViewProps {
  onStart: (settings: Settings) => void;
}

export function renderSettingsView({ onStart }: SettingsViewProps): HTMLElement {
  const container = document.createElement('div');
  container.className = 'settings-screen';

  const title = document.createElement('h1');
  title.textContent = 'Быки и Коровы';
  container.appendChild(title);

  const baseLabel = document.createElement('label');
  baseLabel.textContent = 'Система счисления: ';
  const baseSelect = document.createElement('select');

  [2, 8, 10, 16].forEach((b) => {
    const option = document.createElement('option');
    option.value = b.toString();
    option.textContent =
      b === 2 ? 'BIN (2)' : b === 8 ? 'OCT (8)' : b === 10 ? 'DEC (10)' : 'HEX (16)';
    if (b === 10) option.selected = true;
    baseSelect.appendChild(option);
  });
  baseLabel.appendChild(baseSelect);
  container.appendChild(baseLabel);

  const lengthLabel = document.createElement('label');
  lengthLabel.textContent = ' Длина секретного числа: ';
  const lengthSelect = document.createElement('select');

  const updateLengthOptions = (base: number) => {
    lengthSelect.replaceChildren();
    const maxLength = Math.min(base, 6);
    const minLength = 2;

    for (let l = minLength; l <= maxLength; l++) {
      const option = document.createElement('option');
      option.value = l.toString();
      option.textContent = l.toString();
      if (l === 4 && base >= 4) option.selected = true;
      lengthSelect.appendChild(option);
    }
  };

  baseSelect.addEventListener('change', () => {
    updateLengthOptions(Number(baseSelect.value));
    updateCombinationsHint();
  });

  lengthLabel.appendChild(lengthSelect);
  container.appendChild(lengthLabel);

  const hint = document.createElement('p');
  hint.className = 'combinations-hint';

  const updateCombinationsHint = () => {
    const base = Number(baseSelect.value);
    const length = Number(lengthSelect.value);
    const count = countPossibleSecrets(length, base);
    hint.textContent = `Возможных комбинаций: ${count}`;
  };

  lengthSelect.addEventListener('change', updateCombinationsHint);
  baseLabel.appendChild(baseSelect);
  container.appendChild(hint);

  updateLengthOptions(10);
  updateCombinationsHint();

  const startBtn = document.createElement('button');
  startBtn.textContent = 'Начать игру';
  startBtn.addEventListener('click', () => {
    onStart({
      base: Number(baseSelect.value),
      length: Number(lengthSelect.value),
    });
  });
  container.appendChild(startBtn);

  return container;
}
