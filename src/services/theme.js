const STORAGE_KEY = 'itm-theme';

export function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function getStoredTheme() {
  return localStorage.getItem(STORAGE_KEY);
}

export function getActiveTheme() {
  return getStoredTheme() || getSystemTheme();
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.colorScheme = theme;
}

export function setTheme(theme) {
  localStorage.setItem(STORAGE_KEY, theme);
  applyTheme(theme);
  trackThemeToggle(theme);
}

export function toggleTheme() {
  const next = getActiveTheme() === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

function trackThemeToggle(theme) {
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

export function initTheme() {
  applyTheme(getActiveTheme());

  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    if (!getStoredTheme()) applyTheme(e.matches ? 'light' : 'dark');
  });
}
