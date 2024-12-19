import * as THREE from 'three';
import SpinningCubeDemo from './demos/spinningCube.js';

class DemoApp {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    this.currentDemo = null;
    this.setupDemoButtons();
    this.setupResizeListener();
  }

  setupDemoButtons() {
    const buttons = document.querySelectorAll('.demo-nav-button');
    buttons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const demoName = event.target.dataset.demo;
        this.loadDemo(demoName);
      });
    });
  }

  setupResizeListener() {
    window.addEventListener('resize', () => {
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
      if (this.currentDemo?.camera) {
        this.currentDemo.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.currentDemo.camera.updateProjectionMatrix();
      }
    });
  }

  loadDemo(demoName) {
    if (this.currentDemo) {
      this.currentDemo.dispose(); // Clean up the current demo
    }

    switch (demoName) {
      case 'spinningCube':
        this.currentDemo = new SpinningCubeDemo(this);
        break;
      default:
        console.error(`Demo "${demoName}" not found.`);
        return;
    }

    this.currentDemo.init();
  }
}

const app = new DemoApp('three-canvas');
