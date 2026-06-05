/**
 * Sunrise/sunset calculations adapted from SunCalc (MIT)
 * https://github.com/mourner/suncalc
 */

const PI = Math.PI;
const RAD = PI / 180;
const DAY_MS = 86400000;
const J1970 = 2440588;
const J2000 = 2451545;
const J0 = 0.0009;
const OBLIQUITY = RAD * 23.4397;
const SUN_ALTITUDE = -0.833; // sunrise/sunset with refraction
const STORAGE_GEO = 'itm-geo';

function toJulian(date) {
  return date.valueOf() / DAY_MS - 0.5 + J1970;
}

function fromJulian(j) {
  return new Date((j + 0.5 - J1970) * DAY_MS);
}

function toDays(date) {
  return toJulian(date) - J2000;
}

function solarMeanAnomaly(d) {
  return RAD * (357.5291 + 0.98560028 * d);
}

function eclipticLongitude(M) {
  const C = RAD * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
  const P = RAD * 102.9372;
  return M + C + P + PI;
}

function declination(L) {
  return Math.asin(Math.sin(L) * Math.sin(OBLIQUITY));
}

function julianCycle(d, lw) {
  return Math.round(d - J0 - lw / (2 * PI));
}

function approxTransit(Ht, lw, n) {
  return J0 + (Ht + lw) / (2 * PI) + n;
}

function solarTransitJ(ds, M, L) {
  return J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
}

function hourAngle(h, phi, dec) {
  return Math.acos(
    (Math.sin(h) - Math.sin(phi) * Math.sin(dec)) /
    (Math.cos(phi) * Math.cos(dec)),
  );
}

function getSetJ(h, lw, phi, dec, n, M, L) {
  const w = hourAngle(h, phi, dec);
  const a = approxTransit(w, lw, n);
  return solarTransitJ(a, M, L);
}

export function getSunTimes(latitude, longitude, date = new Date()) {
  const lw = RAD * -longitude;
  const phi = RAD * latitude;
  const d = toDays(date);
  const n = julianCycle(d, lw);
  const ds = approxTransit(0, lw, n);
  const M = solarMeanAnomaly(ds);
  const L = eclipticLongitude(M);
  const dec = declination(L);
  const Jnoon = solarTransitJ(ds, M, L);
  const h0 = SUN_ALTITUDE * RAD;

  const Jset = getSetJ(h0, lw, phi, dec, n, M, L);
  const Jrise = Jnoon - (Jset - Jnoon);

  return {
    sunrise: fromJulian(Jrise),
    sunset: fromJulian(Jset),
  };
}

export function isNightAt(latitude, longitude, when = new Date()) {
  const { sunrise, sunset } = getSunTimes(latitude, longitude, when);
  return when < sunrise || when >= sunset;
}

export function themeFromSun(latitude, longitude, when = new Date()) {
  return isNightAt(latitude, longitude, when) ? 'dark' : 'light';
}

export function estimateCoordsFromTimezone() {
  const offsetHours = -new Date().getTimezoneOffset() / 60;
  return { lat: 40, lng: offsetHours * 15 };
}

export function getStoredGeo() {
  try {
    const raw = localStorage.getItem(STORAGE_GEO);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed.lat === 'number' && typeof parsed.lng === 'number') return parsed;
  } catch { /* ignore */ }
  return null;
}

export function storeGeo(coords) {
  localStorage.setItem(STORAGE_GEO, JSON.stringify({
    lat: coords.lat,
    lng: coords.lng,
    at: Date.now(),
  }));
}

export function msUntilNextTransition(latitude, longitude, when = new Date()) {
  const { sunrise, sunset } = getSunTimes(latitude, longitude, when);
  const night = isNightAt(latitude, longitude, when);

  const next = night
    ? (sunrise > when ? sunrise : addDays(sunrise, 1))
    : (sunset > when ? sunset : addDays(sunset, 1));

  return Math.max(next - when, 60_000);
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function requestGeoLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(getStoredGeo() || estimateCoordsFromTimezone());
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        storeGeo(coords);
        resolve(coords);
      },
      () => resolve(getStoredGeo() || estimateCoordsFromTimezone()),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 86400000 },
    );
  });
}
