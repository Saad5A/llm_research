import { trackPageView } from './analytics.js';

export const ROUTES = [
  { id: 'intro',        path: '/intro',        pageId: 'page-intro',       label: '01 Intro',         shortLabel: 'Introduction',     aliases: [] },
  { id: 'architecture', path: '/architecture', pageId: 'page-arch',        label: '02 Architecture',  shortLabel: 'Architecture',     aliases: ['arch'] },
  { id: 'training',     path: '/training',     pageId: 'page-training',    label: '03 Training',      shortLabel: 'Training',         aliases: [] },
  { id: 'benchmarks',   path: '/benchmarks',   pageId: 'page-benchmarks',  label: '04 Benchmarks',    shortLabel: 'Benchmarks',       aliases: [] },
  { id: 'examples',     path: '/examples',     pageId: 'page-code',        label: '05 Code',          shortLabel: 'Code Examples',    aliases: ['code'] },
  { id: 'guide',        path: '/guide',        pageId: 'page-guide',       label: '06 When to use',   shortLabel: 'Decision Guide',   aliases: [] },
];

let currentRoute = ROUTES[0];
const listeners = new Set();
let pageInitCallbacks = {};

export function registerPageInit(routeId, callback) {
  pageInitCallbacks[routeId] = callback;
}

export function onRouteChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify() {
  listeners.forEach(fn => fn(currentRoute));
}

function resolveRoute(input) {
  if (!input) return ROUTES[0];
  const normalized = input.replace(/^\//, '').toLowerCase();
  return (
    ROUTES.find(r => r.id === normalized) ||
    ROUTES.find(r => r.aliases.includes(normalized)) ||
    ROUTES.find(r => r.path === `/${normalized}`) ||
    ROUTES[0]
  );
}

function pathFromLocation() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  if (path === '/' || path === '/index.html') return '/intro';
  return path;
}

function updateDOM(route) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(route.pageId)?.classList.add('active');

  document.querySelectorAll('.nav-link').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.route === route.id);
    btn.setAttribute('aria-current', btn.dataset.route === route.id ? 'page' : 'false');
  });

  const progress = document.getElementById('navProgress');
  if (progress) {
    const idx = ROUTES.indexOf(route);
    const pct = Math.round(((idx + 1) / ROUTES.length) * 100);
    progress.style.width = `${pct}%`;
    progress.setAttribute('aria-valuenow', String(pct));
  }

  const crumbs = document.getElementById('breadcrumbs');
  if (crumbs) {
    crumbs.innerHTML = `
      <a href="/intro" data-nav="intro">Home</a>
      <span class="bc-sep">/</span>
      <span class="bc-current" aria-current="page">${route.shortLabel}</span>
    `;
    crumbs.querySelector('[data-nav]')?.addEventListener('click', (e) => {
      e.preventDefault();
      navigate('intro');
    });
  }

  document.title = `${route.shortLabel} — Inside the Models`;
  window.scrollTo(0, 0);
}

function runPageInit(route) {
  pageInitCallbacks[route.id]?.();
}

export function navigate(routeInput, { replace = false } = {}) {
  const route = typeof routeInput === 'string' ? resolveRoute(routeInput) : routeInput;
  if (route.id === currentRoute.id && window.location.pathname === route.path) return route;

  currentRoute = route;
  const url = route.path;

  if (replace) history.replaceState({ routeId: route.id }, '', url);
  else history.pushState({ routeId: route.id }, '', url);

  updateDOM(route);
  runPageInit(route);
  trackPageView(route.id);
  notify();
  return route;
}

export function getCurrentRoute() {
  return currentRoute;
}

export function initRouter() {
  const initial = resolveRoute(pathFromLocation().slice(1));
  navigate(initial, { replace: true });

  window.addEventListener('popstate', () => {
    const route = resolveRoute(pathFromLocation().slice(1));
    currentRoute = route;
    updateDOM(route);
    runPageInit(route);
    trackPageView(route.id);
    notify();
  });

  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea, select')) return;
    const idx = ROUTES.indexOf(currentRoute);
    if (e.key === 'ArrowRight' && idx < ROUTES.length - 1) {
      e.preventDefault();
      navigate(ROUTES[idx + 1].id);
    }
    if (e.key === 'ArrowLeft' && idx > 0) {
      e.preventDefault();
      navigate(ROUTES[idx - 1].id);
    }
  });
}

export function goTo(id) {
  return navigate(id);
}

window.goTo = goTo;
