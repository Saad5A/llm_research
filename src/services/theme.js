import {
  themeFromSun,
  requestGeoLocation,
  getStoredGeo,
  estimateCoordsFromTimezone,
  msUntilNextTransition,
} from './solar.js';

const OVERRIDE_KEY = 'itm-theme-override';
const CACHE_KEY = 'itm-auto-theme-cache';

let scheduleTimer = null;
let coords = null;

function getOverride() {
  const v = localStorage.getItem(OVERRIDE_KEY);
  return v === 'light' || v === 'dark' ? v : null;
}

function getAutoTheme() {
  const c = coords || getStoredGeo() || estimateCoordsFromTimezone();
  return themeFromSun(c.lat, c.lng);
}

export function hasManualOverride() {
  return getOverride() !== null;
}

export function getActiveTheme() {
  return getOverride() || getAutoTheme();
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    'content',
    theme === 'dark' ? '#0c0c0e' : '#f7f5f0',
  );

  if (!hasManualOverride()) {
    localStorage.setItem(CACHE_KEY, theme);
  }

  window.dispatchEvent(new CustomEvent('themechange', {
    detail: { theme, manual: hasManualOverride() },
  }));
}

export function toggleTheme() {
  const current = getActiveTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  const solar = getAutoTheme();

  if (next === solar) {
    localStorage.removeItem(OVERRIDE_KEY);
  } else {
    localStorage.setItem(OVERRIDE_KEY, next);
  }

  applyTheme(next);
  syncScheduler();
  return next;
}

function scheduleNextTransition() {
  if (scheduleTimer) clearTimeout(scheduleTimer);
  if (hasManualOverride()) return;

  const c = coords || getStoredGeo() || estimateCoordsFromTimezone();
  const ms = msUntilNextTransition(c.lat, c.lng);
  scheduleTimer = setTimeout(() => {
    applyTheme(getAutoTheme());
    scheduleNextTransition();
  }, ms);
}

function syncScheduler() {
  if (hasManualOverride()) {
    if (scheduleTimer) clearTimeout(scheduleTimer);
    scheduleTimer = null;
  } else {
    applyTheme(getAutoTheme());
    scheduleNextTransition();
  }
}

function migrateLegacyPrefs() {
  const legacy = localStorage.getItem('itm-theme-mode');
  if (!legacy) return;
  if (legacy === 'light' || legacy === 'dark') {
    localStorage.setItem(OVERRIDE_KEY, legacy);
  }
  localStorage.removeItem('itm-theme-mode');
  localStorage.removeItem('itm-theme');
}

export function initTheme() {
  migrateLegacyPrefs();

  const cached = localStorage.getItem(CACHE_KEY);
  if (!hasManualOverride() && cached) {
    applyTheme(cached);
  } else {
    applyTheme(getActiveTheme());
  }

  coords = getStoredGeo() || estimateCoordsFromTimezone();
  syncScheduler();

  requestGeoLocation().then((c) => {
    coords = c;
    syncScheduler();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !hasManualOverride()) {
      applyTheme(getAutoTheme());
      scheduleNextTransition();
    }
  });
}
