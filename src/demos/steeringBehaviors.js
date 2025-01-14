import * as THREE from 'three';

export default class SteeringBehaviors {
  constructor(app, maxSpeed, maxForce, numAgents) {
    this.app = app;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.app.canvas.clientWidth / this.app.canvas.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    // Target to seek
    this.target = new THREE.Vector3(0, 0, 0);

    // Mouse position to target conversion
    this.mousePosition = new THREE.Vector2(0, 0);

    // Constants for agent behavior (can be updated via setters)
    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;
    this.numAgents = numAgents;

    this.agentRadius = 0.025; // Radius for each agent (used in circle geometry)
    this.agentColor = 0x21a1f1; // Color of the agent (same for all)

    this.agents = []; // Array to store agents

    console.log('SteeringBehaviors.js: Steering Demo Constructed');
  }

  setMaxSpeed(newMaxSpeed) {
    this.maxSpeed = newMaxSpeed;
  }

  setMaxForce(newMaxForce) {
    this.maxForce = newMaxForce;
  }

  setNumAgents(newNumAgents) {
    this.numAgents = newNumAgents;
    this.createAgents(); // Recreate agents when the count changes
  }

  // Create or recreate agents
  createAgents() {
    this.agents = []; // Clear previous agents
    for (let i = 0; i < this.numAgents; i++) {
      const geometry = new THREE.CircleGeometry(this.agentRadius, 8); // Create circle geometry with uniform radius
      const material = new THREE.MeshBasicMaterial({ color: this.agentColor });
      const agent = new THREE.Mesh(geometry, material);

      // Set random initial positions for each agent
      agent.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, 0);

      // Store the agent
      this.agents.push(agent);
      this.scene.add(agent);
    }
  }

  init() {
    this.createAgents(); // Create agents initially

    // Add lighting and background
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
    const raycaster = new THREE.Raycaster(); // Create a raycaster
    
    canvas.addEventListener('mousemove', (event) => {
      const rect = canvas.getBoundingClientRect();

      // Normalize mouse coordinates to [-1, 1]
      this.mousePosition.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mousePosition.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Project the normalized mouse coordinates onto a plane in the world
      raycaster.setFromCamera(this.mousePosition, this.camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // XY plane at z = 0
      const intersectPoint = new THREE.Vector3();

      raycaster.ray.intersectPlane(plane, intersectPoint);

      // Update the target position
      this.target.copy(intersectPoint);
    });
  }

  seek(target, agent) {
    const desired = target.clone().sub(agent.position); // Desired velocity
    desired.normalize().multiplyScalar(this.maxSpeed); // Limit speed
    const steer = desired.sub(agent.velocity || new THREE.Vector3()); // Steering force
    steer.clampLength(0, this.maxForce); // Limit steering force
    return steer;
  }

  animate = () => {
    if (this.app.currentDemo !== this && this.app.currentDemo !== null) return;

    requestAnimationFrame(this.animate);

    // Calculate steering force for each agent and update position
    this.agents.forEach(agent => {
      const steer = this.seek(this.target, agent);

      // Apply steering force
      agent.acceleration = steer;
      agent.velocity = agent.velocity ? agent.velocity.add(agent.acceleration) : steer;

      // Limit velocity and update position
      agent.velocity.clampLength(0, this.maxSpeed); // Limit velocity
      agent.position.add(agent.velocity); // Update position

      // Reset acceleration
      agent.acceleration.set(0, 0, 0);
    });

    // Render the scene
    this.app.renderer.render(this.scene, this.camera);
  };

  dispose() {
    this.scene.clear(); // Remove all objects
    console.log('SteeringBehaviors.js: Scene Cleared');
  }
}