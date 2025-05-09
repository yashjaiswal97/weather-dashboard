
import React from 'react';
import './AQICard.css';

interface AQICardProps {
  aqi: number;
}

const getAQIDescription = (value: number) => {
  if (value <= 50) return { label: 'Good', color: '#50f0e6' };
  if (value <= 100) return { label: 'Moderate', color: '#f0e641' };
  if (value <= 150) return { label: 'Unhealthy for Sensitive Groups', color: '#ffb347' };
  if (value <= 200) return { label: 'Unhealthy', color: '#ff5050' };
  if (value <= 300) return { label: 'Very Unhealthy', color: '#960032' };
  return { label: 'Hazardous', color: '#7e0023' };
};

const AQICard: React.FC<AQICardProps> = ({ aqi }) => {
  const { label, color } = getAQIDescription(aqi);
  return (
    <div className="aqi-card" style={{ backgroundColor: color }}>
      <h4>Air Quality Index</h4>
      <p className="aqi-value">AQI: {aqi}</p>
      <p className="aqi-label">{label}</p>
    </div>
  );
};

export default AQICard;
