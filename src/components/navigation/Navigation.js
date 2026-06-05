import { ROUTES, navigate } from '../../services/router.js';
import { toggleTheme, getActiveTheme } from '../../services/theme.js';

export function mountNavigation(root) {
  const linksHtml = ROUTES.map(r => `
    <li>
      <button
        type="button"
        class="nav-link"
        data-route="${r.id}"
        data-nav="${r.id}"
        aria-label="${r.shortLabel}"
      >${r.label}</button>
    </li>
  `).join('');

  root.innerHTML = `
    <header class="site-header" id="siteHeader">
      <nav class="site-nav" aria-label="Main navigation">
        <a class="nav-brand" href="/intro" data-nav="intro">
          <span class="nav-brand-full">Inside the Models</span>
          <span class="nav-brand-short">ITM</span>
        </a>
        <div
          class="nav-progress"
          id="navProgress"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="0"
          aria-label="Reading progress through guide sections"
        ></div>
      </nav>

      <div class="nav-subbar">
        <nav class="nav-panel" id="navPanel" aria-label="Guide sections">
          <ul class="nav-links" id="navLinks">
            ${linksHtml}
          </ul>
        </nav>
        <button
          type="button"
          class="theme-toggle"
          id="themeToggle"
          aria-label="Switch theme"
          title="Switch between light and dark theme"
        >
          <span class="theme-icon" aria-hidden="true"></span>
        </button>
      </div>
    </header>
  `;

  root.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(el.dataset.nav);
    });
  });

  document.getElementById('themeToggle')?.addEventListener('click', () => {
    toggleTheme();
    updateThemeIcon();
  });

  window.addEventListener('themechange', updateThemeIcon);
  updateThemeIcon();
}

function updateThemeIcon() {
  const icon = document.querySelector('.theme-icon');
  const btn = document.getElementById('themeToggle');
  if (!icon || !btn) return;

  const theme = getActiveTheme();
  const next = theme === 'dark' ? 'light' : 'dark';

  icon.textContent = theme === 'dark' ? '☀' : '☾';
  btn.setAttribute('aria-label', `Switch to ${next} theme`);
  btn.setAttribute('title', `Switch to ${next} theme`);
}
