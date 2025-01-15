import React, { useState, useEffect } from 'react';
import { workExperienceData } from '../data/workExperienceData';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const WorkExperience = () => {
  
  const isVisible = useIntersectionObserver('.workexperience');

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
