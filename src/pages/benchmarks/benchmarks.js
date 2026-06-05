import { getData } from '../../services/loader.js';

let activeFilter = 'all';
let benchmarks = [];

export function initBenchmarks() {
  benchmarks = getData().benchmarks.benchmarks;
  bindFilters();
  renderTable();
}

function bindFilters() {
  document.querySelectorAll('.bench-filter').forEach(btn => {
    btn.addEventListener('click', () => setBenchFilter(btn.dataset.filter));
  });
}

export function setBenchFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll('.bench-filter').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  renderTable();
}

function renderTable() {
  const tbody = document.getElementById('benchTbody');
  if (!tbody) return;

  const filtered = activeFilter === 'all'
    ? benchmarks
    : benchmarks.filter(b => b.category === activeFilter);

  tbody.innerHTML = filtered.map(b => `
    <tr>
      <td>
        <div class="bench-name">${b.name}</div>
        <div class="bench-note">${b.note}</div>
      </td>
      <td>${renderScore(b.bert, 'bert', b.winner)}</td>
      <td>${renderScore(b.claude, 'claude', b.winner)}</td>
      <td>${renderScore(b.llama, 'llama', b.winner)}</td>
    </tr>
  `).join('');
}

function renderScore(value, model, winner) {
  const display = value > 0 ? value : 'N/A';
  const color = value > 0 ? `var(--${model})` : 'var(--color-text-secondary)';
  return `
    <div class="bench-bar-wrap">
      <div class="bench-bar-track"><div class="bench-bar-fill bar-${model}" style="width:${value}%"></div></div>
      <span class="bench-score" style="color:${color}">${display}</span>
      ${winner === model ? '<span class="winner-badge">best</span>' : ''}
    </div>`;
}

window.setBenchFilter = setBenchFilter;
