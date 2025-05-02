import React, { useState, useEffect, useRef } from 'react';
import { fetchWeatherByCity, fetchForecastByCity, searchCities, fetchWAQIAqi } from '../utils/api';
import WeatherCard from '../components/WeatherCard';
import ForecastRowGrouped from '../components/ForecastRow';
import HourlyForecast from '../components/HourlyForecast';
import WeatherTrendsChart from '../components/WeatherTrendsChart';
import AQICard from '../components/AQICard';
import './home.css';

const Home = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [aqi, setAqi] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [theme, setTheme] = useState<string>('default');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const determineTheme = (condition: string, isDay: boolean) => {
    const prefix = isDay ? 'day' : 'night';
    if (condition.includes('cloud')) return `${prefix}-cloudy`;
    if (condition.includes('rain')) return `${prefix}-rainy`;
    if (condition.includes('clear')) return `${prefix}-clear`;
    if (condition.includes('snow')) return `${prefix}-snowy`;
    if (condition.includes('thunder')) return `${prefix}-stormy`;
    return `${prefix}-default`;
  };

  useEffect(() => {
    const getLocationWeather = () => {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          setLoading(true);
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
          );
          const data = await res.json();
          setCity(data.name);
          setWeather(data);

          const forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
          );
          const forecastData = await forecastRes.json();
          setForecast(forecastData.list);

          const aqiRes = await fetchWAQIAqi(data.name);
          if (aqiRes.status === 'ok') setAqi(aqiRes.data.aqi);

          const condition = data.weather[0].main.toLowerCase();
          const now = data.dt;
          const isDay = now > data.sys.sunrise && now < data.sys.sunset;
          setTheme(determineTheme(condition, isDay));
        } catch (error) {
          console.error('Geo weather error', error);
        } finally {
          setLoading(false);
        }
      });
    };
    getLocationWeather();
  }, []);

  useEffect(() => {
    const drops = document.querySelectorAll('.raindrop');
    drops.forEach(drop => {
      const el = drop as HTMLElement;
      el.style.left = `${Math.random() * 100}%`;
      el.style.animationDuration = `${0.5 + Math.random()}s`;
      el.style.animationDelay = `${Math.random() * 5}s`;
    });

    const flakes = document.querySelectorAll('.snowflake');
    flakes.forEach(flake => {
      const el = flake as HTMLElement;
      el.style.left = `${Math.random() * 100}%`;
      el.style.animationDuration = `${2 + Math.random() * 3}s`;
      el.style.fontSize = `${14 + Math.random() * 10}px`;
      el.style.animationDelay = `${Math.random() * 5}s`;
    });
  }, [theme]);

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;

    if (theme.includes('rainy')) {
      audio.src = '/sounds/rain.mp3';
    } else if (theme.includes('clear')) {
      audio.src = '/sounds/birds.mp3';
    } else if (theme.includes('cloudy')) {
      audio.src = '/sounds/wind.mp3';
    } else if (theme.includes('stormy')) {
      audio.src = '/sounds/thunder.mp3';
    } else {
      audio.src = '';
    }

    if (audio.src) {
      audio.volume = 0.2;
      audio.loop = true;
      audio.play().catch(err => console.error('Audio error:', err));
    }
  }, [theme]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;
    setSuggestions([]);
    setCity('');
    setLoading(true);
    setError('');
    try {
      const current = await fetchWeatherByCity(city);
      const forecastData = await fetchForecastByCity(city);

      const aqiRes = await fetchWAQIAqi(city);
      if (aqiRes.status === 'ok') setAqi(aqiRes.data.aqi);

      setWeather(current);
      setForecast(forecastData.list);

      const condition = current.weather[0].main.toLowerCase();
      const now = current.dt;
      const isDay = now > current.sys.sunrise && now < current.sys.sunset;
      setTheme(determineTheme(condition, isDay));
    } catch (err) {
      setError('City not found or API error.');
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchFromSuggestion = async (cityName: string) => {
    setCity('');
    setSuggestions([]);
    setLoading(true);
    setError('');
    try {
      const current = await fetchWeatherByCity(cityName);
      const forecastData = await fetchForecastByCity(cityName);

      const aqiRes = await fetchWAQIAqi(cityName);
      if (aqiRes.status === 'ok') setAqi(aqiRes.data.aqi);

      setWeather(current);
      setForecast(forecastData.list);

      const condition = current.weather[0].main.toLowerCase();
      const now = current.dt;
      const isDay = now > current.sys.sunrise && now < current.sys.sunset;
      setTheme(determineTheme(condition, isDay));
    } catch (err) {
      setError('City not found.');
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`home ${theme}`}>
      <audio ref={audioRef} />

      {theme.includes('rainy') && (
        <div className="rain-container">
          {[...Array(100)].map((_, i) => (
            <div key={i} className="raindrop" />
          ))}
        </div>
      )}

      {theme.includes('snowy') && (
        <div className="snow-container">
          {[...Array(80)].map((_, i) => (
            <div key={i} className="snowflake">❄</div>
          ))}
        </div>
      )}

      <div className="weather-decor"></div>

      {favorites.length > 0 && (
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {favorites.map((favCity) => (
            <button key={favCity} onClick={() => handleSearchFromSuggestion(favCity)}>
              {favCity}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={async (e) => {
            const value = e.target.value;
            setCity(value);
            if (value.length >= 2) {
              const results = await searchCities(value);
              setSuggestions(results);
            } else {
              setSuggestions([]);
            }
          }}
        />
        <button type="submit">Search</button>
      </form>

      {suggestions.length > 0 && (
        <ul className="autocomplete-dropdown">
          {suggestions.map((item, idx) => (
            <li key={idx} onClick={() => handleSearchFromSuggestion(item.name)}>
              {item.name}, {item.state ? item.state + ', ' : ''}{item.country}
            </li>
          ))}
        </ul>
      )}

      {loading && <p className="loading">Loading</p>}
      {error && <p>{error}</p>}

      {weather && (
        <>
          <WeatherCard
            city={weather.name}
            temperature={weather.main.temp}
            description={weather.weather[0].description}
            icon={weather.weather[0].icon}
            feelsLike={weather.main.feels_like}
            min={weather.main.temp_min}
            max={weather.main.temp_max}
          />

          {aqi !== null && <AQICard aqi={aqi} />}

          <HourlyForecast forecast={forecast} />
          <WeatherTrendsChart forecast={forecast} />

          {!favorites.includes(weather.name) && (
            <button
              onClick={() => {
                const updated = [...favorites, weather.name];
                setFavorites(updated);
                localStorage.setItem('favorites', JSON.stringify(updated));
              }}
              style={{ marginTop: '10px' }}
            >
              ⭐ Save {weather.name} to Favorites
            </button>
          )}
        </>
      )}

      {forecast.length > 0 && (
        <div>
          <h3 style={{ color: '#fff', marginTop: '20px' }}>5-Day Forecast</h3>
          <ForecastRowGrouped forecast={forecast} />
        </div>
      )}
    </div>
  );
};

export default Home;
