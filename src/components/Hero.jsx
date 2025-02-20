import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <header className="hero">
      <h1>Hi, I'm Chance!</h1>
      <p>Welcome to my personal website. Explore my journey, projects, and aspirations in technology and beyond.</p>
      <Link to="/experiments" className="cta-button"> Explore Demos </Link>
    </header>
  );
}

export default Hero;
