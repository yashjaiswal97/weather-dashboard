
import React from 'react';
import './HourlyForecast.css';

interface HourlyForecastProps {
  forecast: any[];
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ forecast }) => {
  const next24Hours = forecast.slice(0, 8); // 8 entries = 24 hours (3h each)

  return (
    <div className="hourly-container">
      {next24Hours.map((hour, index) => (
        <div className="hour-card" key={index}>
          <p className="hour-time">{new Date(hour.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <img
            src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
            alt={hour.weather[0].description}
            className="hour-icon"
          />
          <p className="hour-temp">{Math.round(hour.main.temp)}°C</p>
        </div>
      ))}
    </div>
  );
};

export default HourlyForecast;
