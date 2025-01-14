import React, { useState, useEffect } from 'react';
import { educationData } from '../data/educationData';

const Education = () => {  // [TODO] Add IntersectionObserver to trigger animation instead of using isVisible state
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

    const section = document.querySelector('.education');
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
    <section className={`education ${isVisible ? 'visible' : ''}`}>
      <h2>Education</h2>
      <div className="card-container">
        {educationData.map((school, index) => (
          <div key={index} className="card">
            <h3>{school.school}</h3>
            <p>{school.degree}</p>
            <p>{school.duration}</p>
            <h4>Relevant Coursework:</h4>
            <ul>
              {school.coursework.map((course, i) => (
                <li key={i}>{course}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Education;
