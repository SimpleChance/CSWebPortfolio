import React, { useState, useEffect } from 'react';
import { educationData } from '../data/educationData';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const Education = () => { 

  const isVisible = useIntersectionObserver('.education');

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
