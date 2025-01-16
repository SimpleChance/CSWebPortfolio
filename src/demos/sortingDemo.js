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

    this.dataSize = 10000; // Number of elements to sort (default: 10,000)

    this.init(); // Initialize the demo

    console.log('sortingDemo.js: Sorting Demo Constructed');
  }


  // [TODO: Implement sorting algorithms]
  insertionSort = (arr) => {
  }

  selectionSort = (arr) => {
  }

  mergeSort = (arr) => {
  }

  bubbleSort = (arr) => {
  }

  quickSort = (arr) => {
  }

  heapSort = (arr) => {
  }

  initializeRandomData = () => {
    const data = Array.apply(null, Array(this.dataSize)).map(function (x, i) { return i; });
    console.log('sortingDemo.js: Random Data Initialized:', data);
  }

  init = () => {
    console.log('sortingDemo.js: Sorting Demo Initialized');
    this.initializeRandomData(); // Initialize random data
    this.animate(); // Start the animation loop
  }

  animate = () => {
    if (this.app.currentDemo !== this && this.app.currentDemo !== null) return;

    requestAnimationFrame(this.animate);
    
    // Render the scene
    this.app.renderer.render(this.scene, this.camera);

    console.log('sortingDemo.js: Sorting Demo Animated');
  };

  dispose = () => {
    this.scene.clear(); // Remove all objects
    console.log('sortingDemo.js: Scene Cleared');
  }
}
