import React, { useState, useEffect } from 'react';
import { workExperienceData } from '../data/workExperienceData';

const WorkExperience = () => { // [TODO: Add IntersectionObserver to trigger animation instead of using isVisible state]
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

    const section = document.querySelector('.workexperience');
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
    <section className={`workexperience ${isVisible ? 'visible' : ''}`}>
      <h2>Work Experience</h2>
      <div className="card-container">
        {workExperienceData.map((job, index) => (
          <div key={index} className="card">
            <h3>{job.title}</h3>
            <p>{job.duration}</p>
            <ul>
              {job.responsibilities.map((task, i) => (
                <li key={i}>{task}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WorkExperience;
