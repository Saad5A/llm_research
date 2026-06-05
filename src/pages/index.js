import pagesHtml from './templates/pages.html?raw';

export function mountPages(root) {
  root.innerHTML = pagesHtml;
  bindInlineHandlers();
}

function bindInlineHandlers() {
  document.querySelectorAll('#app [onclick*="goTo"]').forEach(el => {
    const match = el.getAttribute('onclick')?.match(/goTo\('([^']+)'\)/);
    if (!match) return;
    const route = match[1];
    el.removeAttribute('onclick');
    el.addEventListener('click', () => window.goTo(route));
  });

  document.querySelectorAll('#app [onclick*="showArch"]').forEach(el => {
    const match = el.getAttribute('onclick')?.match(/showArch\('([^']+)'\)/);
    if (!match) return;
    el.removeAttribute('onclick');
    el.dataset.model = match[1];
    el.addEventListener('click', () => window.showArch(match[1]));
  });

  document.querySelectorAll('#app [onclick*="setAttnMode"]').forEach(el => {
    const match = el.getAttribute('onclick')?.match(/setAttnMode\('([^']+)'\)/);
    if (!match) return;
    el.removeAttribute('onclick');
    el.addEventListener('click', () => window.setAttnMode(match[1]));
  });

  document.querySelectorAll('#app [onclick*="setBenchFilter"]').forEach(el => {
    const match = el.getAttribute('onclick')?.match(/setBenchFilter\('([^']+)'\)/);
    if (!match) return;
    el.removeAttribute('onclick');
    el.dataset.filter = match[1];
    el.addEventListener('click', () => window.setBenchFilter(match[1]));
  });

  document.querySelectorAll('#app [onclick*="setChip"]').forEach(el => {
    const match = el.getAttribute('onclick')?.match(/setChip\('([^']+)'\)/);
    if (!match) return;
    el.removeAttribute('onclick');
    el.dataset.chip = match[1];
    el.addEventListener('click', () => window.setChip(match[1]));
  });

  document.querySelectorAll('#app [onclick*="sendQA"]').forEach(el => {
    el.removeAttribute('onclick');
    el.addEventListener('click', () => window.sendQA());
  });

  document.querySelectorAll('#app [onclick*="advanceFlow"]').forEach(el => {
    const match = el.getAttribute('onclick')?.match(/advanceFlow\('([^']+)'\)/);
    if (!match) return;
    el.removeAttribute('onclick');
    el.addEventListener('click', () => window.advanceFlow(match[1]));
  });

  document.querySelectorAll('#app [onclick*="resetFlow"]').forEach(el => {
    el.removeAttribute('onclick');
    el.addEventListener('click', () => window.resetFlow());
  });
}
