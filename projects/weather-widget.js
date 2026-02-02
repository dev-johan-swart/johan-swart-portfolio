// weather-widget.js
const apiKey = 'dd0e45ab08353975e66a3a852f4b4f03'; // copy from your .env key
const weatherContainer = document.getElementById('weather-widget');

async function fetchWeather(city = 'Johannesburg') {
  try {
    weatherContainer.innerHTML = 'Loading weather...';
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    if (!res.ok) throw new Error('City not found or API error');
    const data = await res.json();

    weatherContainer.innerHTML = `
      <h3>Weather in ${data.name}</h3>
      <p>Temperature: ${data.main.temp}°C</p>
      <p>Condition: ${data.weather[0].description}</p>
      <input type="text" id="city-input" placeholder="Enter city" />
      <button id="get-weather-btn">Get Weather</button>
    `;

    document.getElementById('get-weather-btn').addEventListener('click', () => {
      const city = document.getElementById('city-input').value;
      fetchWeather(city);
    });
  } catch (err) {
    weatherContainer.innerHTML = `<p>Error: ${err.message}</p>`;
  }
}

// initial fetch
fetchWeather();
