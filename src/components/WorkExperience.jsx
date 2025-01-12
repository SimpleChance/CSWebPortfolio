import React, { useState, useEffect } from 'react';

const workExperienceData = [
  {
    title: 'Tutor – Marshall University',
    duration: '2024 - 2025',
    responsibilities: [
      'Provided one-on-one tutoring sessions to undergraduate students in CS courses.',
      'Assisted with algorithms, data structures, and debugging in Python.',
      'Collaborated with professors to align tutoring sessions with course objectives.',
    ],
  },
  {
    title: 'Grader – Marshall University',
    duration: '2023 - 2024',
    responsibilities: [
      'Evaluated and provided constructive feedback on assignments and exams for undergraduate CS courses.',
      'Ensured fair and consistent grading in line with course rubrics and professor expectations.',
      'Communicated with students to clarify grading decisions and offer guidance for improvement.',
    ],
  },
  {
    title: 'Car Wash Attendant – MightyShine',
    duration: '2022 - 2024',
    responsibilities: [
      'Streamlined gift card generation with Microsoft Excel.',
      'Digitized membership forms into a searchable database.',
    ],
  },
  {
    title: 'Waitstaff & Food Prep - IScream Sundae',
    duration: '2018 - 2022',
    responsibilities: [
      'Provided excellent customer service by taking orders, serving food, and ensuring a welcoming environment.',
      'Prepared and assembled menu items, maintaining high standards of quality and cleanliness.',
      'Handled cash and card transactions, balanced registers, and assisted in training new team members.',
    ],
  },
];

const WorkExperience = () => {
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
