// =============================================================================
// main.js — App entry point: initialise all phase modules
// =============================================================================

import { initNav, goTo }       from './nav.js';
import { initArch, showArch, setAttnMode } from './arch.js';
import { initTraining }        from './training.js';
import { initBenchmarks, setBenchFilter } from './benchmarks.js';
import { initGuide, sendQA, setChip }     from './guide.js';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initArch();
  initTraining();
  initBenchmarks();
  initGuide();

  // Code copy buttons
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pre = btn.closest('.code-block')?.querySelector('pre');
      if (!pre) return;
      navigator.clipboard.writeText(pre.innerText).then(() => {
        btn.textContent = 'copied!';
        setTimeout(() => btn.textContent = 'copy', 1600);
      });
    });
  });

  // Code tab switching
  document.querySelectorAll('.code-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.panel;
      document.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.code-panel').forEach(p => p.classList.remove('visible'));
      tab.classList.add('active');
      document.getElementById('code-panel-' + target)?.classList.add('visible');
    });
  });

  // Q&A enter key
  document.getElementById('qaInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendQA(); }
  });
});
