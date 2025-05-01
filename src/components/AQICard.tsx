import React from 'react';
import './AQICard.css';

interface AQICardProps {
  aqi: number;
}

const getAQIDescription = (value: number) => {
  switch (value) {
    case 1: return { label: 'Good', color: '#50f0e6' };
    case 2: return { label: 'Fair', color: '#50ccaa' };
    case 3: return { label: 'Moderate', color: '#f0e641' };
    case 4: return { label: 'Poor', color: '#ff5050' };
    case 5: return { label: 'Very Poor', color: '#960032' };
    default: return { label: 'Unknown', color: '#999' };
  }
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
