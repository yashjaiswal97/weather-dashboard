import React, { useState } from 'react';
import { fetchWeatherByCity, fetchForecastByCity } from '../utils/api';
import WeatherCard from '../components/WeatherCard';
import ForecastRow from '../components/ForecastRow';
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError('');
    try {
      const current = await fetchWeatherByCity(city);
      const forecastData = await fetchForecastByCity(city);
      setWeather(current);
      setForecast(forecastData.list);
    } catch (err) {
      setError('City not found or API error.');
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {favorites.length > 0 && (
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {favorites.map((favCity) => (
            <button
              key={favCity}
              onClick={async () => {
                setCity(favCity);
                setLoading(true);
                try {
                  const current = await fetchWeatherByCity(favCity);
                  const forecastData = await fetchForecastByCity(favCity);
                  setWeather(current);
                  setForecast(forecastData.list);
                } catch {
                  setError('City not found.');
                  setWeather(null);
                  setForecast([]);
                } finally {
                  setLoading(false);
                }
              }}
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
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p className="loading"></p>}
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
          <ForecastRow forecast={forecast} />
        </div>
      )}
    </div>
  );
};

export default Home;
