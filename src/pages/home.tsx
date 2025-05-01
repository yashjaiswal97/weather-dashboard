import React, { useState, useEffect } from 'react';
import { fetchWeatherByCity, fetchForecastByCity, searchCities } from '../utils/api';
import WeatherCard from '../components/WeatherCard';
import ForecastRowGrouped from '../components/ForecastRow';
import HourlyForecast from '../components/HourlyForecast';
import WeatherTrendsChart from '../components/WeatherTrendsChart';
import './home.css';

const Home = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [theme, setTheme] = useState<string>('default');

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
          const condition = data.weather[0].main.toLowerCase();
          setTheme(determineTheme(condition));
        } catch (error) {
          console.error('Geo weather error', error);
        } finally {
          setLoading(false);
        }
      });
    };
    getLocationWeather();
  }, []);

  const determineTheme = (condition: string) => {
    if (condition.includes('cloud')) return 'cloudy';
    if (condition.includes('rain')) return 'rainy';
    if (condition.includes('clear')) return 'sunny';
    if (condition.includes('snow')) return 'snowy';
    if (condition.includes('thunder')) return 'stormy';
    return 'default';
  };

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
      setWeather(current);
      setForecast(forecastData.list);
      const condition = current.weather[0].main.toLowerCase();
      setTheme(determineTheme(condition));
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
      setWeather(current);
      setForecast(forecastData.list);
      const condition = current.weather[0].main.toLowerCase();
      setTheme(determineTheme(condition));
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
      <div className="weather-particles">
        <div className="particles" />
      </div>
      <div className="weather-decor"></div>

      {favorites.length > 0 && (
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {favorites.map((favCity) => (
            <button
              key={favCity}
              onClick={() => handleSearchFromSuggestion(favCity)}
            >
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
          <HourlyForecast forecast={forecast} />
          {forecast.length > 0 && <WeatherTrendsChart forecast={forecast} />}
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