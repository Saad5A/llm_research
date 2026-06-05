import { ROUTES, navigate } from '../../services/router.js';
import { toggleTheme, getActiveTheme } from '../../services/theme.js';

export function mountNavigation(root) {
  root.innerHTML = `
    <nav role="navigation" aria-label="Main">
      <a class="nav-brand" href="/intro" data-nav="intro">Inside the Models</a>
      <div class="nav-links" role="menubar">
        ${ROUTES.map(r => `
          <button class="nav-link" role="menuitem" data-route="${r.id}" data-nav="${r.id}" aria-label="${r.shortLabel}">
            ${r.label}
          </button>
        `).join('')}
      </div>
      <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme" title="Toggle light/dark theme">
        <span class="theme-icon" aria-hidden="true"></span>
      </button>
      <div class="nav-progress" id="navProgress" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div>
    </nav>
    <div class="breadcrumbs" id="breadcrumbs" aria-label="Breadcrumb"></div>
  `;

  root.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(el.dataset.nav);
    });
  });

  updateThemeIcon();
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    toggleTheme();
    updateThemeIcon();
  });
  window.addEventListener('themechange', updateThemeIcon);
}

function updateThemeIcon() {
  const icon = document.querySelector('.theme-icon');
  if (!icon) return;
  icon.textContent = getActiveTheme() === 'dark' ? '☀' : '☾';
}
