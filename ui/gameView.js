import { createDigitValidator } from '../createDigitalValidator.js';
import { loadScores, isTopResult } from '../scoreService.js';
export function renderGameView({ state, onGuess, onRestart, onSaveScore, }) {
    const container = document.createElement('div');
    container.className = 'game-screen';
    const info = document.createElement('p');
    info.textContent = `Режим: Длина ${state.settings.length}, Base ${state.settings.base}`;
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
        if (e.key === 'Enter')
            handleSubmission();
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
        input.disabled = true;
        submitBtn.disabled = true;
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        const winModal = document.createElement('div');
        winModal.className = 'win-modal-popup';
        const winTitle = document.createElement('h2');
        winTitle.textContent = '🎉 Победа!';
        winModal.appendChild(winTitle);
        const duration = Math.floor((Date.now() - state.startTime) / 1000);
        const winDetails = document.createElement('p');
        winDetails.textContent = `Вы угадали число ${state.secret.toUpperCase()} за ${state.history.length} попыток и ${duration} сек.!`;
        winModal.appendChild(winDetails);
        const currentScores = loadScores();
        const qualifiesForTop = isTopResult(currentScores, state.history.length, duration);
        if (qualifiesForTop) {
            onSaveScore('Игрок', state.history.length, duration);
            const recordTitle = document.createElement('h3');
            recordTitle.textContent = '🏆 Результат автоматически сохранен в Топ-10!';
            recordTitle.style.color = 'var(--color-cow)';
            winModal.appendChild(recordTitle);
        }
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'В меню настроек';
        closeBtn.className = 'modal-close-btn';
        if (qualifiesForTop) {
            closeBtn.style.backgroundColor = 'var(--color-bull)';
            closeBtn.style.border = 'none';
        }
        closeBtn.addEventListener('click', () => {
            modalOverlay.remove();
            onRestart();
        });
        winModal.appendChild(closeBtn);
        modalOverlay.appendChild(winModal);
        document.body.appendChild(modalOverlay);
    }
    return container;
}
