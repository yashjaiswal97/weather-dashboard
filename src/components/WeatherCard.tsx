import React from 'react';
import './WeatherCard.css';

interface WeatherCardProps {
  city: string;
  temperature: number;
  description: string;
  icon: string;
  feelsLike: number;
  min: number;
  max: number;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  city,
  temperature,
  description,
  icon,
  feelsLike,
  min,
  max,
}) => {
  return (
    <div className="weather-card">
      <h2>{city}</h2>
      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={description}
        className="weather-icon"
      />
      <h3>{temperature.toFixed(1)}°C</h3>
      <p>{description}</p>
      <div className="extra-info">
        <p>Feels like: {feelsLike}°C</p>
        <p>Min: {min}°C | Max: {max}°C</p>
      </div>
    </div>
  );
};

export default WeatherCard;
