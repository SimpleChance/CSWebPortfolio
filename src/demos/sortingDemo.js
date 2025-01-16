import * as THREE from 'three';


// [TODO: Implement SortingDemo]
export default class SortingDemo {
  constructor(app) {
    this.app = app;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.app.canvas.clientWidth / this.app.canvas.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    this.init(); // Initialize the demo

    console.log('sortingDemo.js: Sorting Demo Constructed');
  }

  init() {
    // Create a cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    console.log('sortingDemo.js: Sorting Demo Initialized');
    this.animate(); // Start the animation loop
  }

  animate = () => {
    if (this.app.currentDemo !== this && this.app.currentDemo !== null) return;

    requestAnimationFrame(this.animate);
    
    // Render the scene
    this.app.renderer.render(this.scene, this.camera);

    console.log('sortingDemo.js: Sorting Demo Animated');
  };

  dispose() {
    this.scene.clear(); // Remove all objects
    console.log('sortingDemo.js: Scene Cleared');
  }
}
