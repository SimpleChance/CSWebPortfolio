import React, { useState } from 'react';
import DemoSelector from '../components/DemoSelector';
import ThreeCanvas from '../components/ThreeCanvas';

const Experiments = () => {
  const [currentDemo, setCurrentDemo] = useState('steeringBehaviors'); // Default to Steering Behaviors

  const handleDemoSelect = (demoId) => {
    setCurrentDemo(demoId);
  };

  return (
    <div>
      <DemoSelector onDemoSelect={handleDemoSelect} />
      <ThreeCanvas demo={currentDemo} />
    </div>
  );
};

export default Experiments;
