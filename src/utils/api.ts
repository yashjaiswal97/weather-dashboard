// src/utils/api.ts
import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchWeatherByCity = async (city: string) => {
  const res = await axios.get(`${BASE_URL}/weather`, {
    params: {
      q: city,
      units: 'metric',
      appid: API_KEY,
    },
  });
  return res.data;
};

export const fetchForecastByCity = async (city: string) => {
  const res = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      q: city,
      units: 'metric',
      appid: API_KEY,
    },
  });
  return res.data;
};

export const searchCities = async (query: string) => {
    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
    );
    return res.json();
  };

  export const fetchAQIByCoords = async (lat: number, lon: number) => {
    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    return res.json();
  };
  