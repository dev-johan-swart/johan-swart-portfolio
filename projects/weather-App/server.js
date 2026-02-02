require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch'); 
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const API_KEY = process.env.OPENWEATHER_API_KEY;

// Route: Current Weather 
app.get('/api/weather', async (req, res) => {
  const { lat, lon, q } = req.query;

  try {
    let url;

    if (q) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${API_KEY}&units=metric`;
    } else if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    } else {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Weather fetch failed' });
  }
});

// Route: 3-Day Forecast (using 5-day/3-hour free API)
app.get('/api/forecast', async (req, res) => {
  const { lat, lon, q } = req.query;

  if (!lat && !q) return res.status(400).json({ error: "Missing coordinates or city name" });

  try {
    let url;
    if (q) {
      url = `https://api.openweathermap.org/data/2.5/forecast?q=${q}&appid=${API_KEY}&units=metric`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    }

    const response = await fetch(url);
    const data = await response.json();

    // Group by date (YYYY-MM-DD)
    const daily = {};
    data.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (!daily[date]) daily[date] = [];
      daily[date].push(item);
    });

    // Take next 3 days (skip today if needed)
    const dates = Object.keys(daily).slice(0, 3);

    const forecastArr = dates.map(date => {
      const dayItems = daily[date];
      const temps = dayItems.map(i => i.main.temp);

      // Pick item closest to 12:00
      let midDayItem = dayItems.reduce((prev, curr) => {
        const prevDiff = Math.abs(new Date(prev.dt_txt).getHours() - 12);
        const currDiff = Math.abs(new Date(curr.dt_txt).getHours() - 12);
        return currDiff < prevDiff ? curr : prev;
      });

      return {
        date,
        temp: { min: Math.min(...temps), max: Math.max(...temps) },
        icon: midDayItem.weather[0].icon,
        description: midDayItem.weather[0].description
      };
    });

    res.json({ daily: forecastArr });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Forecast fetch failed' });
  }
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  if (!API_KEY) {
    console.log("ERROR: OPENWEATHER_API_KEY not set in environment.");
  }
  console.log(`Server running at http://localhost:${PORT}`);
});
