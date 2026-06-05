import {
  themeFromSun,
  requestGeoLocation,
  getStoredGeo,
  estimateCoordsFromTimezone,
  msUntilNextTransition,
} from './solar.js';

const MODE_KEY = 'itm-theme-mode';
const CACHE_KEY = 'itm-auto-theme-cache';

let scheduleTimer = null;
let coords = null;

export const THEME_MODES = ['auto', 'light', 'dark'];

export function getThemeMode() {
  const mode = localStorage.getItem(MODE_KEY);
  return THEME_MODES.includes(mode) ? mode : 'auto';
}

export function getActiveTheme() {
  const mode = getThemeMode();
  if (mode === 'light') return 'light';
  if (mode === 'dark') return 'dark';
  return getAutoTheme();
}

function getAutoTheme() {
  const c = coords || getStoredGeo() || estimateCoordsFromTimezone();
  return themeFromSun(c.lat, c.lng);
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    'content',
    theme === 'dark' ? '#0c0c0e' : '#f7f5f0',
  );

  if (getThemeMode() === 'auto') {
    localStorage.setItem(CACHE_KEY, theme);
  }

  window.dispatchEvent(new CustomEvent('themechange', {
    detail: { theme, mode: getThemeMode() },
  }));
}

export function setThemeMode(mode) {
  localStorage.setItem(MODE_KEY, mode);
  applyTheme(getActiveTheme());
  if (mode === 'auto') scheduleNextTransition();
}

export function toggleTheme() {
  const mode = getThemeMode();
  const nextMode = mode === 'auto' ? 'light' : mode === 'light' ? 'dark' : 'auto';
  setThemeMode(nextMode);
  return { mode: nextMode, theme: getActiveTheme() };
}

function scheduleNextTransition() {
  if (scheduleTimer) clearTimeout(scheduleTimer);
  if (getThemeMode() !== 'auto') return;

  const c = coords || getStoredGeo() || estimateCoordsFromTimezone();
  const ms = msUntilNextTransition(c.lat, c.lng);
  scheduleTimer = setTimeout(() => {
    applyTheme(getAutoTheme());
    scheduleNextTransition();
  }, ms);
}

function applyAutoTheme() {
  if (getThemeMode() !== 'auto') return;
  applyTheme(getAutoTheme());
  scheduleNextTransition();
}

export function initTheme() {
  const cached = localStorage.getItem(CACHE_KEY);
  const mode = getThemeMode();

  if (mode === 'auto' && cached) {
    applyTheme(cached);
  } else {
    applyTheme(getActiveTheme());
  }

  coords = getStoredGeo() || estimateCoordsFromTimezone();
  applyAutoTheme();

  requestGeoLocation().then((c) => {
    coords = c;
    applyAutoTheme();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') applyAutoTheme();
  });
}
