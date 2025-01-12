import React from 'react';
import Hero from '../components/Hero';
import Skills from '../components/Skills';
import WorkExperience from '../components/WorkExperience';
import Education from '../components/Education';

const LandingPage = () => {
  return (
    <div>
      <Hero />
      <WorkExperience />
      <Education />
      <Skills />
    </div>
  );
};

export default LandingPage;
