import { ROUTES, navigate, onRouteChange } from '../../services/router.js';
import { toggleTheme, getActiveTheme } from '../../services/theme.js';

const FOCUSABLE = 'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

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

        <div class="nav-toolbar">
          <button
            type="button"
            class="theme-toggle"
            id="themeToggle"
            aria-label="Switch theme"
            title="Switch between light and dark theme"
          >
            <span class="theme-icon" aria-hidden="true"></span>
          </button>
          <button
            type="button"
            class="nav-toggle"
            id="navToggle"
            aria-expanded="false"
            aria-controls="navPanel"
            aria-label="Open navigation menu"
          >
            <span class="nav-toggle-icon" aria-hidden="true"></span>
          </button>
        </div>

        <div class="nav-panel" id="navPanel" aria-hidden="true">
          <ul class="nav-links" id="navLinks">
            ${linksHtml}
          </ul>
        </div>

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

      <div class="breadcrumbs" id="breadcrumbs" aria-label="Breadcrumb"></div>
    </header>
  `;

  const header = root.querySelector('#siteHeader');
  const toggle = root.querySelector('#navToggle');
  const panel = root.querySelector('#navPanel');

  const menu = createMobileMenu({ header, toggle, panel });

  root.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(el.dataset.nav);
      menu.close();
    });
  });

  document.getElementById('themeToggle')?.addEventListener('click', () => {
    toggleTheme();
    updateThemeIcon();
  });

  window.addEventListener('themechange', updateThemeIcon);
  onRouteChange(() => menu.close());
  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 768px)').matches) menu.close();
  });

  function syncViewportA11y() {
    if (window.matchMedia('(min-width: 768px)').matches) {
      panel.setAttribute('aria-hidden', 'false');
      panel.removeAttribute('inert');
    } else if (!menu.isOpen) {
      panel.setAttribute('aria-hidden', 'true');
      panel.setAttribute('inert', '');
    }
  }

  syncViewportA11y();
  window.addEventListener('resize', syncViewportA11y);
  updateThemeIcon();
}

function createMobileMenu({ header, toggle, panel }) {
  let isOpen = false;
  let lastFocus = null;

  function setA11y(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    panel.setAttribute('aria-hidden', String(!open));

    if (open) {
      panel.removeAttribute('inert');
    } else {
      panel.setAttribute('inert', '');
    }
  }

  function open() {
    if (isOpen || !isMobileViewport()) return;
    isOpen = true;
    lastFocus = document.activeElement;
    header.classList.add('is-menu-open');
    document.body.classList.add('is-nav-open');
    setA11y(true);
    requestAnimationFrame(() => {
      panel.querySelector(FOCUSABLE)?.focus();
    });
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    header.classList.remove('is-menu-open');
    document.body.classList.remove('is-nav-open');
    if (isMobileViewport()) setA11y(false);
    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
    }
  }

  function toggleMenu() {
    if (isOpen) close();
    else open();
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }

    if (e.key === 'Tab') {
      trapFocus(e, panel);
    }
  });

  return {
    open,
    close,
    get isOpen() { return isOpen; },
  };
}

function isMobileViewport() {
  return window.matchMedia('(max-width: 767px)').matches;
}

function trapFocus(e, container) {
  const focusable = [...container.querySelectorAll(FOCUSABLE)].filter(
    el => el.offsetParent !== null || el === document.activeElement
  );
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
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
