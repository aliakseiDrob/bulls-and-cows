import { ScoreEntry } from '../scoreService.js';

interface LeaderboardViewProps {
  readonly scores: readonly ScoreEntry[];
}

export function renderLeaderboardView({ scores }: LeaderboardViewProps): HTMLElement {
  const container = document.createElement('div');
  container.className = 'leaderboard-section';

  const title = document.createElement('h2');
  title.textContent = '🏆 Таблица рекордов';
  container.appendChild(title);

  if (scores.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.className = 'empty-scores';
    emptyMsg.textContent = 'Рекордов пока нет. Станьте первым!';
    container.appendChild(emptyMsg);
    return container;
  }

  const table = document.createElement('table');
  table.className = 'leaderboard-table';

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  ['Место', 'Игрок', 'Режим', 'Попытки', 'Время'].forEach((text) => {
    const th = document.createElement('th');
    th.textContent = text;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  scores.forEach((entry, idx) => {
    const row = document.createElement('tr');

    const rankCell = document.createElement('td');
    rankCell.textContent = `#${idx + 1}`;
    rankCell.className = `rank-cell rank-${idx + 1}`;

    const nameCell = document.createElement('td');
    nameCell.textContent = entry.name;

    const modeCell = document.createElement('td');
    const badge = document.createElement('span');
    const modeName =
      entry.settings.base === 2
        ? 'BIN'
        : entry.settings.base === 8
          ? 'OCT'
          : entry.settings.base === 10
            ? 'DEC'
            : 'HEX';
    badge.textContent = `${entry.settings.length}D / ${modeName}`;
    badge.className = `mode-badge base-${entry.settings.base}`;
    modeCell.appendChild(badge);

    const attemptsCell = document.createElement('td');
    attemptsCell.textContent = entry.attempts.toString();

    const timeCell = document.createElement('td');
    timeCell.textContent = `${entry.duration} сек`;

    row.append(rankCell, nameCell, modeCell, attemptsCell, timeCell);
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  container.appendChild(table);
  return container;
}
