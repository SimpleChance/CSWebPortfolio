import React, { useState, useEffect } from 'react';

const educationData = [
  {
    school: 'Marshall University',
    degree: 'Bachelor of Science in Computer Science',
    duration: 'Fall 2022 - Present',
    coursework: ['Database Engineering', 'Software Engineering', 'Internetworking', 'Advanced Algorithms'],
  },
  {
    school: 'University of Southern California',
    degree: 'Bachelor of Science in Computer Science (Transferred)',
    duration: 'Fall 2019 - Fall 2022',
    coursework: [
      'Calculus 1–3',
      'Linear Algebra',
      'Discrete Math',
      'Statistics for Data Science',
      'Data Structures in C++',
      'Introduction to Electrical Engineering (Arduino, breadboards, microcontrollers)',
    ],
  },
];

const Education = () => {
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
