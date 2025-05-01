// src/components/WeatherTrendsChart.tsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface WeatherTrendsChartProps {
  forecast: any[];
}

const WeatherTrendsChart: React.FC<WeatherTrendsChartProps> = ({ forecast }) => {
  const chartData = forecast.slice(0, 8).map((hour) => ({
    time: new Date(hour.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: Math.round(hour.main.temp),
    humidity: hour.main.humidity,
  }));

  return (
    <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="time" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip />
          <Line type="monotone" dataKey="temp" stroke="#ff7300" strokeWidth={2} name="Temperature (°C)" />
          <Line type="monotone" dataKey="humidity" stroke="#00bfff" strokeWidth={2} name="Humidity (%)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeatherTrendsChart;
