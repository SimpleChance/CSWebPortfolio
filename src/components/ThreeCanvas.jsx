import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import SpinningCube from '../demos/spinningCube';
import SteeringBehaviors from '../demos/steeringBehaviors'; // Import the SteeringDemo

const ThreeCanvas = ({ demo }) => {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null); // Store renderer in ref
  const cameraRef = useRef(null); // Store camera in ref
  const [aspectRatio, setAspectRatio] = useState(window.innerWidth / window.innerHeight);

  const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Calculate the canvas size to be 80% of the width/height
    const canvasWidth = width * 0.8;
    const canvasHeight = height * 0.8;

    // Calculate the new aspect ratio based on the new width/height
    const newAspectRatio = canvasWidth / canvasHeight;

    if (newAspectRatio !== aspectRatio) {
      setAspectRatio(newAspectRatio);
      
      const canvas = canvasRef.current;
      const renderer = rendererRef.current;
      const camera = cameraRef.current;

      if (canvas && renderer && camera) {
        // Set the new canvas size
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        renderer.setSize(canvasWidth, canvasHeight);

        // Adjust the camera's aspect ratio based on the new window size
        camera.aspect = newAspectRatio;
        camera.updateProjectionMatrix(); // Update the projection matrix after aspect ratio change
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8); // Set initial renderer size to 80% of the window
    rendererRef.current = renderer; // Store renderer in ref

    // Setup a basic background color to ensure it's rendering
    renderer.setClearColor(0xf0f0f0, 1); // Light gray background

    const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    cameraRef.current = camera; // Store camera in ref

    // Setup scene and other Three.js objects
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
      currentDemoInstance = new SteeringBehaviors(app);
    }

    currentDemoInstance.init();
    app.currentDemo = currentDemoInstance;

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      if (currentDemoInstance) {
        currentDemoInstance.dispose();
      }
      window.removeEventListener('resize', handleResize); // Remove event listener on cleanup
    };
  }, [demo, aspectRatio]); // Ensure to run effect when demo or aspectRatio changes

  return (
    <div className="canvas-wrapper">
      <canvas ref={canvasRef} className="three-canvas" />
    </div>
  );
};

export default ThreeCanvas;
