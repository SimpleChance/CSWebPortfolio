import React from 'react';
import { HashRouterRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Experiments from './pages/Experiments';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/CSWebPortfolio" element={<LandingPage />} />
          <Route path="/experiments" element={<Experiments />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
