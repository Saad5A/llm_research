// =============================================================================
// nav.js — Page routing, progress bar, and navigation state
// =============================================================================

export const PAGES = ['intro', 'arch', 'training', 'benchmarks', 'code', 'guide'];

let currentPage = 'intro';

export function initNav() {
  updateProgress();
}

export function goTo(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id)?.classList.add('active');
  document.querySelectorAll('.nav-link').forEach((l, i) => {
    l.classList.toggle('active', PAGES[i] === id);
  });
  window.scrollTo(0, 0);
  currentPage = id;
  updateProgress();
}

function updateProgress() {
  const idx = PAGES.indexOf(currentPage);
  const pct = ((idx + 1) / PAGES.length) * 100;
  const bar = document.getElementById('navProgress');
  if (bar) bar.style.width = pct + '%';
}

// Expose globally for inline onclick handlers
window.goTo = goTo;
