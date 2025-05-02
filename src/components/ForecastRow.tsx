import React from 'react';
import './ForecastRow.css';

interface ForecastItem {
  dt_txt: string;
  main: { temp: number };
  weather: { description: string; icon: string }[];
}

interface GroupedForecast {
  [date: string]: ForecastItem[];
}

interface ForecastRowGroupedProps {
  forecast: ForecastItem[];
}

const ForecastRowGrouped: React.FC<ForecastRowGroupedProps> = ({ forecast }) => {
  // Group forecast items by date
  const grouped: GroupedForecast = forecast.reduce((acc, item) => {
    const date = item.dt_txt.split(' ')[0]; 
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {} as GroupedForecast);

  return (
    <div className="forecast-grouped">
      {Object.entries(grouped).slice(0, 5).map(([date, entries]) => {
        const averageTemp =
          entries.reduce((sum, entry) => sum + entry.main.temp, 0) / entries.length;
        const icon = entries[0].weather[0].icon;

        return (
          <div key={date} className="forecast-card">
            <p className="forecast-time">{new Date(date).toDateString()}</p>
            <img
              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
              alt=""
              className="forecast-icon"
            />
            <p className="forecast-temp">{Math.round(averageTemp)}°C</p>
            
            
          </div>
        );
      })}
    </div>
  );
};

export default ForecastRowGrouped;
