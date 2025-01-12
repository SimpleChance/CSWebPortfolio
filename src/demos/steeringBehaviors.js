// SteeringDemo.js
import * as THREE from 'three';

export default class SteeringBehaviors {
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

    this.target = new THREE.Vector3(0, 0, 0);  // The target to seek
    this.position = new THREE.Vector3(2, 2, 0); // Start position of the object
    this.velocity = new THREE.Vector3(); // Velocity of the object
    this.acceleration = new THREE.Vector3(); // Acceleration of the object

    this.maxSpeed = 0.1;  // Maximum speed of the object
    this.maxForce = 0.01; // Maximum force for steering

    this.mousePosition = new THREE.Vector2(0, 0); // Store mouse position

    this.cube = null;

    console.log('SteeringBehaviors.js: Steering Demo Constructed');
  }

  init() {
    // Create geometry for the object (cube)
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    // Add lighting (optional)
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    this.scene.add(light);

    this.scene.background = new THREE.Color(0xf0f0f0);

    // Add mouse event listeners
    this.addMouseListeners();

    console.log('SteeringBehaviors.js: Steering Demo Initialized');
    this.animate();
  }

  addMouseListeners() {
    const canvas = this.app.renderer.domElement;
    canvas.addEventListener('mousemove', (event) => {
      const rect = canvas.getBoundingClientRect();
      this.mousePosition.x = (event.clientX - rect.left) / rect.width * 2 - 1; // Normalize to [-1, 1]
      this.mousePosition.y = -((event.clientY - rect.top) / rect.height * 2 - 1); // Normalize to [-1, 1]

      // Update target position based on mouse position
      this.target.set(this.mousePosition.x * 5, this.mousePosition.y * 5, 0); // Scale mouse position to world coordinates
    });
  }

  seek(target) {
    const desired = target.clone().sub(this.position); // Desired velocity
    desired.normalize().multiplyScalar(this.maxSpeed); // Limit speed
    const steer = desired.sub(this.velocity); // Steering force
    steer.clampLength(0, this.maxForce); // Limit steering force
    return steer;
  }

  animate = () => {
    if (this.app.currentDemo !== this && this.app.currentDemo !== null) return;

    requestAnimationFrame(this.animate);

    // Calculate steering force and update velocity and position
    const steer = this.seek(this.target);
    this.acceleration.add(steer);
    this.velocity.add(this.acceleration);
    this.velocity.clampLength(0, this.maxSpeed); // Limit velocity
    this.position.add(this.velocity); // Update position
    this.acceleration.set(0, 0, 0); // Reset acceleration

    // Update cube position
    this.cube.position.copy(this.position);

    // Render the scene
    this.app.renderer.render(this.scene, this.camera);
    console.log('SteeringBehaviors.js: Animating');
  };

  dispose() {
    this.scene.clear(); // Remove all objects
    console.log('SteeringBehaviors.js: Scene Cleared');
  }
}
