import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="app">
        <h1>🚀 Davidhub - Plataforma de Colaboração Git</h1>
        <p>CEO e Criador: David Adriano Ferrari dos Santos</p>
        <Routes>
          <Route path="/" element={<h2>Welcome to Davidhub</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
