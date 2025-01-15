import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import SpinningCube from '../demos/spinningCube';
import SteeringBehaviors from '../demos/steeringBehaviors';

const ThreeCanvas = ({ demo }) => {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const [aspectRatio, setAspectRatio] = useState(window.innerWidth / window.innerHeight);

  // State for agent settings [Not Ideal to have this here, but it works for now]
  const [maxSpeed, setMaxSpeed] = useState(0.25);
  const [maxForce, setMaxForce] = useState(0.005);
  const [numAgents, setNumAgents] = useState(2500);

  const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const canvasWidth = width * 0.8;
    const canvasHeight = height * 0.8;
    const newAspectRatio = canvasWidth / canvasHeight;

    if (newAspectRatio !== aspectRatio) {
      setAspectRatio(newAspectRatio);
      const canvas = canvasRef.current;
      const renderer = rendererRef.current;
      const camera = cameraRef.current;

      if (canvas && renderer && camera) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        renderer.setSize(canvasWidth, canvasHeight);
        camera.aspect = newAspectRatio;
        camera.updateProjectionMatrix();
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
    rendererRef.current = renderer;

    renderer.setClearColor(0xf0f0f0, 1);

    const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 5000);
    cameraRef.current = camera;

    const scene = new THREE.Scene();
    const app = {
      canvas,
      renderer,
      camera,
      scene,
      currentDemo: null,
    };

    let currentDemoInstance;
    if (demo === 'spinningCube') {
      currentDemoInstance = new SpinningCube(app);
    } else if (demo === 'steeringBehaviors') {
      currentDemoInstance = new SteeringBehaviors(app, maxSpeed, maxForce, numAgents);
    }

    currentDemoInstance.init();
    app.currentDemo = currentDemoInstance;

    window.addEventListener('resize', handleResize);

    return () => {
      if (currentDemoInstance) {
        currentDemoInstance.dispose();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [demo, aspectRatio, maxSpeed, maxForce, numAgents]);

  return (
    <div className="canvas-wrapper">
      <canvas ref={canvasRef} className="three-canvas" />
    </div>
  );
};

export default ThreeCanvas;
