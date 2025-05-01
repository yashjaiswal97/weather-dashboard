// src/App.tsx
import React from 'react';
import Home from './pages/home'; // adjust path if needed
import './App.css'; // optional styling

const App: React.FC = () => {
  return (
    <div className="App">
      <Home />
    </div>
  );
};

export default App;