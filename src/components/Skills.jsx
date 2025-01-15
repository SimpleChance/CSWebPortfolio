import React, { useState, useEffect } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const Skills = () => {
  
  const isVisible = useIntersectionObserver('.skills');

  return (
    <section className={`skills ${isVisible ? 'visible' : ''}`}>
      <h2>Skills</h2>
      <div className="skill-grid">
        <span>Python</span>
        <span>JavaScript</span>
        <span>C++</span>
        <span>HTML</span>
        <span>CSS</span>
        <span>Three.js</span>
        <span>Git</span>
        <span>MySQL</span>
      </div>
    </section>
  );
};

export default Skills;
