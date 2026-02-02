(() => {
  const statusEl = document.getElementById('status');
  const locBtn = document.getElementById('loc-btn');
  const sourceLink = document.getElementById('source-link');
  const locationEl = document.getElementById('location');
  const timeEl = document.getElementById('time');
  const tempEl = document.getElementById('temperature');
  const condEl = document.getElementById('conditions');
  const iconEl = document.getElementById('icon');
  const feelsEl = document.getElementById('feels');
  const humidityEl = document.getElementById('humidity');
  const windEl = document.getElementById('wind');

  const form = document.getElementById('search-form');
  const input = document.getElementById('city-input');
  const forecastEl = document.getElementById('forecast');

  function setStatus(msg) { statusEl.textContent = msg; }
  function formatTime(ts) { return new Date(ts * 1000).toLocaleString(); }

  function updateUI(data) {
    if (!data) return;
    locationEl.textContent = `${data.name}, ${data.sys?.country || ''}`;
    timeEl.textContent = formatTime(data.dt);
    tempEl.textContent = `${Math.round(data.main.temp)}°C`;
    condEl.textContent = data.weather[0]?.description || '--';
    feelsEl.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidityEl.textContent = `${data.main.humidity}%`;
    windEl.textContent = `${Math.round(data.wind.speed)} m/s`;
    const iconCode = data.weather[0]?.icon;
    iconEl.src = iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : '';
    sourceLink.href = `https://openweathermap.org/city/${data.id}`;
  }

  function renderForecast(days) {
    forecastEl.innerHTML = '';
    days.forEach(day => {
      const el = document.createElement('div');
      el.className = 'forecast-day';
      const date = new Date(day.date).toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' });
      el.innerHTML = `
        <p class="f-date">${date}</p>
        <img class="f-icon" src="https://openweathermap.org/img/wn/${day.icon}.png">
        <p class="f-temp">${Math.round(day.temp.min)}°C - ${Math.round(day.temp.max)}°C</p>
        <p class="f-desc">${day.description}</p>
      `;
      forecastEl.appendChild(el);
    });
  }

  async function fetchWeatherByCoords(lat, lon) {
    setStatus('Fetching weather…');
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      updateUI(data);

      const forecastRes = await fetch(`/api/forecast?lat=${lat}&lon=${lon}`);
      const forecastData = await forecastRes.json();
      if(forecastData.daily) renderForecast(forecastData.daily);

      setStatus('Live data loaded.');
    } catch (err) { console.error(err); setStatus('Could not load weather.'); }
  }

  async function fetchWeatherByCity(city) {
    if (!city) return;
    setStatus(`Searching weather for "${city}"…`);
    try {
      const res = await fetch(`/api/weather?q=${encodeURIComponent(city)}`);
      const data = await res.json();
      if (data.cod === "404") { setStatus("City not found."); return; }
      updateUI(data);

      const forecastRes = await fetch(`/api/forecast?q=${encodeURIComponent(city)}`);
      const forecastData = await forecastRes.json();
      if(forecastData.daily) renderForecast(forecastData.daily);

      setStatus("Live data loaded.");
    } catch (err) { console.error(err); setStatus('Failed to fetch city weather.'); }
  }

  function useBrowserLocation(fallbackCity = "Johannesburg") {
    if (!navigator.geolocation) {
      setStatus("Browser does not support geolocation. Showing Johannesburg.");
      fetchWeatherByCity(fallbackCity);
      return;
    }
    setStatus("Requesting your location…");
    navigator.geolocation.getCurrentPosition(
      pos => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
      err => { console.warn(err); setStatus("Location blocked. Showing Johannesburg."); fetchWeatherByCity(fallbackCity); },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }

  locBtn.addEventListener('click', () => useBrowserLocation());
  form.addEventListener('submit', e => { e.preventDefault(); if(input.value.trim()) fetchWeatherByCity(input.value.trim()); input.value=''; });
  window.addEventListener('load', () => { setStatus('Ready. Detecting location…'); useBrowserLocation(); });
})();
