const STORAGE_KEY = 'itm-analytics';

function readEvents() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function trackPageView(routeId) {
  const events = readEvents();
  events.push({ type: 'pageview', route: routeId, at: Date.now() });
  if (events.length > 200) events.splice(0, events.length - 200);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function trackEvent(name, meta = {}) {
  const events = readEvents();
  events.push({ type: name, meta, at: Date.now() });
  if (events.length > 200) events.splice(0, events.length - 200);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function getAnalyticsSummary() {
  const events = readEvents();
  const views = events.filter(e => e.type === 'pageview');
  const counts = views.reduce((acc, e) => {
    acc[e.route] = (acc[e.route] || 0) + 1;
    return acc;
  }, {});
  return { totalViews: views.length, byRoute: counts };
}
