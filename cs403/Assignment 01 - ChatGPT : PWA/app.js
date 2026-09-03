const SETTINGS_KEY = 'weather-schedule-settings';
const scope = 'https://www.googleapis.com/auth/calendar.readonly';
const $ = (selector) => document.querySelector(selector);
const els = { schedule: $('#schedule'), date: $('#date-label'), summary: $('#summary'), location: $('#location-label'), settingsPanel: $('#settings-panel'), locationInput: $('#location-input'), calendarInput: $('#calendar-id-input'), clientInput: $('#google-client-id'), status: $('#settings-status') };
let settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
let tokenClient;
let calendarEvents = [];

const weatherSymbol = (code) => ({ 0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 45: '🌫️', 48: '🌫️', 51: '🌦️', 53: '🌦️', 55: '🌧️', 61: '🌧️', 63: '🌧️', 65: '🌧️', 71: '🌨️', 73: '🌨️', 75: '🌨️', 80: '🌦️', 81: '🌧️', 82: '⛈️', 95: '⛈️', 96: '⛈️', 99: '⛈️' }[code] || '🌡️');
const weatherText = (code) => ({ 0: 'Clear', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Overcast', 45: 'Foggy', 48: 'Foggy', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle', 61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 80: 'Showers', 81: 'Showers', 82: 'Heavy showers', 95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm' }[code] || 'Forecast');
const hourLabel = (hour) => `${hour}:00`;
const saveSettings = () => localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));

function setLoading() { els.schedule.replaceChildren($('#loading-template').content.cloneNode(true)); }
function getGeo() { return new Promise((resolve, reject) => navigator.geolocation ? navigator.geolocation.getCurrentPosition(p => resolve({ latitude: p.coords.latitude, longitude: p.coords.longitude, name: 'Current location' }), reject, { timeout: 8000 }) : reject()); }
async function geocode(query) {
  if (!query) return getGeo();
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`);
  const data = await response.json();
  if (!data.results?.[0]) throw new Error('Location not found. Try a city or ZIP code.');
  const place = data.results[0];
  return { latitude: place.latitude, longitude: place.longitude, name: [place.name, place.admin1, place.country_code].filter(Boolean).join(', ') };
}
async function loadForecast() {
  setLoading();
  try {
    const place = await geocode(settings.location);
    const params = new URLSearchParams({ latitude: place.latitude, longitude: place.longitude, hourly: 'temperature_2m,precipitation_probability,weather_code', daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max', timezone: 'auto', forecast_days: 2, temperature_unit: 'fahrenheit' });
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    if (!response.ok) throw new Error('Weather service is unavailable.');
    const data = await response.json();
    render(data, place.name);
  } catch (error) {
    els.location.textContent = 'Location: unavailable';
    els.summary.textContent = error.message || 'Unable to load the forecast.';
    els.schedule.innerHTML = '<div class="empty-state">Open Settings to choose a location and try again.</div>';
    els.settingsPanel.hidden = false;
  }
}
function eventsForHour(isoHour) {
  const start = new Date(`${isoHour}:00`); const end = new Date(start.getTime() + 3600000);
  return calendarEvents.filter(event => !event.allDay && event.start < end && event.end > start);
}
function render(data, name) {
  const { hourly, daily } = data;
  const today = new Date(`${hourly.time[0]}:00`);
  els.date.textContent = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(today);
  els.location.textContent = `Location: ${name}`;
  els.summary.textContent = `Today: High ${Math.round(daily.temperature_2m_max[0])}° / Low ${Math.round(daily.temperature_2m_min[0])}° / Max rain ${daily.precipitation_probability_max[0] ?? 0}%`;
  const frag = document.createDocumentFragment();
  const now = new Date();
  let dayIndex = -1;
  hourly.time.forEach((isoHour, index) => {
    const rowDate = new Date(`${isoHour}:00`);
    const dateKey = isoHour.slice(0, 10);
    const isToday = dateKey === hourly.time[0].slice(0, 10);
    if (isToday && rowDate.getHours() < now.getHours()) return;
    const newDay = dayIndex === -1 || hourly.time[index - 1].slice(0, 10) !== dateKey;
    if (newDay) {
      dayIndex++;
      const label = dayIndex === 0 ? `Today (${rowDate.getMonth() + 1}/${rowDate.getDate()})` : `Tomorrow (${rowDate.getMonth() + 1}/${rowDate.getDate()})`;
      const banner = document.createElement('div');
      banner.className = 'day-banner';
      banner.innerHTML = `<strong>${label}</strong><span class="day-high-low">${Math.round(daily.temperature_2m_max[dayIndex])}° / ${Math.round(daily.temperature_2m_min[dayIndex])}°</span>`;
      frag.append(banner);
      const allDay = calendarEvents.filter(event => event.allDay && event.date === dateKey);
      if (allDay.length) {
        const allDayRow = document.createElement('div'); allDayRow.className = 'schedule-row all-day-row';
        allDayRow.innerHTML = `<div class="time all-day">ALL DAY</div><div></div><div class="event-list">${allDay.map(event => `<span class="event all-day">${escapeHtml(event.title)}</span>`).join('')}</div>`;
        frag.append(allDayRow);
      }
    }
    const row = document.createElement('div');
    const hour = rowDate.getHours();
    row.className = `schedule-row ${isToday && now.getHours() === hour ? 'current' : ''}`;
    const events = eventsForHour(isoHour);
    const eventMarkup = events.length ? `<div class="event-list">${events.map(e => `<span class="event ${e.allDay ? 'all-day' : ''}">${escapeHtml(e.title)}</span>`).join('')}</div>` : '<span class="no-event">—</span>';
    row.innerHTML = `<div class="time">${hourLabel(hour)}</div><div class="weather"><span class="weather-icon">${weatherSymbol(hourly.weather_code[index])}</span><div><div class="weather-main">${Math.round(hourly.temperature_2m[index])}° · ${weatherText(hourly.weather_code[index])}</div><div class="weather-detail">Rain ${hourly.precipitation_probability[index] ?? 0}%</div></div></div><div>${eventMarkup}</div>`;
    frag.append(row);
  });
  els.schedule.replaceChildren(frag);
}
function escapeHtml(value) { const element = document.createElement('span'); element.textContent = value; return element.innerHTML; }
function normalizeEvents(items) { return items.map(event => { const allDay = Boolean(event.start.date); return { title: event.summary || '(Untitled event)', allDay, date: allDay ? event.start.date : null, start: allDay ? null : new Date(event.start.dateTime), end: allDay ? null : new Date(event.end.dateTime) }; }); }
async function fetchCalendar() {
  if (!sessionStorage.getItem('google-access-token')) return;
  const now = new Date(); const end = new Date(now); end.setDate(end.getDate() + 1); end.setHours(23, 59, 59, 999);
  const params = new URLSearchParams({ timeMin: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString(), timeMax: end.toISOString(), singleEvents: 'true', orderBy: 'startTime' });
  const calendarId = encodeURIComponent(settings.calendarId || 'primary');
  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${params}`, { headers: { Authorization: `Bearer ${sessionStorage.getItem('google-access-token')}` } });
  if (response.ok) calendarEvents = normalizeEvents((await response.json()).items || []);
}
function connectGoogle() {
  const clientId = els.clientInput.value.trim() || settings.clientId;
  if (!clientId) { els.status.textContent = 'Enter your Google OAuth Client ID first.'; return; }
  settings.clientId = clientId; saveSettings();
  if (!window.google?.accounts?.oauth2) { els.status.textContent = 'Google sign-in is still loading. Please try once more.'; return; }
  tokenClient = google.accounts.oauth2.initTokenClient({ client_id: clientId, scope, callback: async (response) => { if (response.error) { els.status.textContent = 'Google Calendar connection was cancelled or failed.'; return; } sessionStorage.setItem('google-access-token', response.access_token); els.status.textContent = 'Connected to Google Calendar.'; await fetchCalendar(); await loadForecast(); } });
  tokenClient.requestAccessToken({ prompt: 'consent' });
}
$('#settings-button').addEventListener('click', () => { const visible = !els.settingsPanel.hidden; els.settingsPanel.hidden = visible; if (!visible) { els.locationInput.value = settings.location || ''; els.calendarInput.value = settings.calendarId || ''; els.clientInput.value = settings.clientId || ''; els.status.textContent = sessionStorage.getItem('google-access-token') ? 'Google Calendar is connected for this session.' : ''; } });
$('#save-location').addEventListener('click', async () => { settings.location = els.locationInput.value.trim(); saveSettings(); await loadForecast(); });
$('#connect-calendar').addEventListener('click', async () => { settings.calendarId = els.calendarInput.value.trim(); saveSettings(); if (!sessionStorage.getItem('google-access-token')) { els.status.textContent = 'Enter your Google OAuth Client ID below, then select Sign in.'; return; } await fetchCalendar(); await loadForecast(); els.status.textContent = 'Calendar updated.'; });
$('#private-calendar-button').addEventListener('click', connectGoogle);

if ('serviceWorker' in navigator) navigator.serviceWorker.register('./service-worker.js');
(async () => {
  await fetchCalendar();
  await loadForecast();
})();
