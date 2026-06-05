const OVERRIDE_KEY = 'itm-theme-override';
const DEFAULT_THEME = 'light';

function getOverride() {
  const v = localStorage.getItem(OVERRIDE_KEY);
  return v === 'light' || v === 'dark' ? v : null;
}

export function hasManualOverride() {
  return getOverride() !== null;
}

export function getActiveTheme() {
  return getOverride() || DEFAULT_THEME;
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    'content',
    theme === 'dark' ? '#0c0c0e' : '#f7f5f0',
  );

  window.dispatchEvent(new CustomEvent('themechange', {
    detail: { theme, manual: hasManualOverride() },
  }));
}

export function toggleTheme() {
  const next = getActiveTheme() === 'dark' ? 'light' : 'dark';

  if (next === DEFAULT_THEME) {
    localStorage.removeItem(OVERRIDE_KEY);
  } else {
    localStorage.setItem(OVERRIDE_KEY, next);
  }

  applyTheme(next);
  return next;
}

function migrateLegacyPrefs() {
  const legacyMode = localStorage.getItem('itm-theme-mode');
  if (legacyMode === 'light' || legacyMode === 'dark') {
    if (legacyMode === DEFAULT_THEME) localStorage.removeItem(OVERRIDE_KEY);
    else localStorage.setItem(OVERRIDE_KEY, legacyMode);
  }
  localStorage.removeItem('itm-theme-mode');
  localStorage.removeItem('itm-theme');
  localStorage.removeItem('itm-auto-theme-cache');
  localStorage.removeItem('itm-geo');
}

export function initTheme() {
  migrateLegacyPrefs();
  applyTheme(getActiveTheme());
}
