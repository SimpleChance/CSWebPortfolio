import React, { useState } from 'react';

const demoList = [
  { id: 'steeringBehaviors', name: 'Steering Behaviors' },
  { id: 'sortingDemo', name: 'Sorting Demo' },
  // { id: 'steeringBehaviorsGPU', name: 'Steering Bahviors on GPU' },
  { id: 'spinningCube', name: 'Spinning Cube' }
];

const DemoSelector = ({ onDemoSelect }) => {
  const [selectedDemo, setSelectedDemo] = useState(demoList[0].id); // Default to the first demo

  const handleDemoChange = (demoId) => {
    setSelectedDemo(demoId);
    onDemoSelect(demoId);
  };

  return (
    <div className="demo-header">
      <h2>Three.js Demos</h2>
      <p>Choose a demo to get started</p>
      <div className="demo-list">
        {demoList.map((demo) => (
          <button
            key={demo.id}
            className={`demo-nav-button ${selectedDemo === demo.id ? 'selected' : ''}`}
            onClick={() => handleDemoChange(demo.id)}
          >
            {demo.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DemoSelector;