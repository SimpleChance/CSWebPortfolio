import React, { useState, useEffect } from 'react';

const Skills = () => {  // Add IntersectionObserver to trigger animation instead of using isVisible state
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.25) {
            setIsVisible(true);
          } else if (entry.intersectionRatio <= 0.15) {
            setIsVisible(false);
          }
        });
      },
      { threshold: [0.15, 0.25] }
    );

    const section = document.querySelector('.skills');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

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
