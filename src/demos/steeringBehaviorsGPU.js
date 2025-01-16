// steeringBehaviors.js

// [TODO: This is broken lol]
import * as THREE from 'three';

export default class SteeringBehaviorsGPU {
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
    
    this.clock = new THREE.Clock(); // Create a clock for timing

    // Number of agents and texture size
    this.numAgents = numAgents;
    this.textureSize = Math.ceil(Math.sqrt(this.numAgents));

    // Max speed and force constraints and target position
    this.mousePosition = new THREE.Vector2(0, 0);
    this.target = new THREE.Vector3(0, 0, 0);
    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;

    // Initialize agent data (positions and velocities)
    const agentData = new Float32Array(this.textureSize * this.textureSize * 4);
    for (let i = 0; i < this.numAgents; i++) {
      agentData[i * 4] = Math.random() * 10 - 5; // x position
      agentData[i * 4 + 1] = Math.random() * 10 - 5; // y position
      agentData[i * 4 + 2] = 0; // z position (unused, remain in XY plane)
      agentData[i * 4 + 3] = 0; // Velocity magnitude
    }

    // Create initial data texture
    this.dataTexture = new THREE.DataTexture(
      agentData,
      this.textureSize,
      this.textureSize,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    this.dataTexture.needsUpdate = true;

    // Setup compute and render targets
    this.renderTargetA = new THREE.WebGLRenderTarget(this.textureSize, this.textureSize, {
      type: THREE.FloatType,
    });
    this.renderTargetB = new THREE.WebGLRenderTarget(this.textureSize, this.textureSize, {
      type: THREE.FloatType,
    });

    // Create compute shader material
    this.computeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        agentData: { value: this.dataTexture },
        deltaTime: { value: 0.016 },
        target: { value: new THREE.Vector3(0, 0, 0) },
        maxSpeed: { value: this.maxSpeed },
        maxForce: { value: this.maxForce },
        textureSize: { value: this.textureSize },
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;

        uniform sampler2D agentData;
        uniform float deltaTime;
        uniform vec3 target;
        uniform float maxSpeed;
        uniform float maxForce;
        uniform float textureSize;

        out vec4 updatedState;

        void main() {
          vec2 uv = gl_FragCoord.xy / textureSize;
          vec4 state = texture(agentData, uv);

          vec3 position = state.xyz;
          vec3 velocity = state.w;

          // Keep in XY plane
          position.z = 0.0;
          velocity.z = 0.0;

          // Compute steering force (simple cohesion to target)
          vec3 desired = normalize(target - position) * maxSpeed;
          vec3 steering = desired - velocity;

          // Limit the magnitude of the steering force
          float steeringMagnitude = length(steering);
          if (steeringMagnitude > maxForce) {
            steering = normalize(steering) * maxForce;
          }

          // Update velocity and position
          velocity += steering * deltaTime;

          // Limit the magnitude of the velocity
          float speed = length(velocity);
          if (speed > maxSpeed) {
            velocity = normalize(velocity) * maxSpeed;
          }

          position += velocity * deltaTime;

          // Write updated state
          updatedState = vec4(position, velocity);
        }
      `,
    });
  }

  init() {
      // Create geometry and material for rendering agents
      this.agentGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(this.numAgents * 3);
      for (let i = 0; i < this.numAgents; i++) {
        positions[i * 4] = Math.random() * 10 - 5;
        positions[i * 4 + 1] = Math.random() * 10 - 5;
        positions[i * 4 + 2] = 0; // Z position remains 0 (XY plane)
      }
      this.agentGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      this.agentMaterial = new THREE.PointsMaterial({ size: 0.1, color: 0xffffff });
      this.agentPoints = new THREE.Points(this.agentGeometry, this.agentMaterial);
      this.scene.add(this.agentPoints);

      this.addMouseListeners(); // Add mouse event listeners
      this.animate(); // Start the animation loop
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

  update(deltaTime) {
    // Update uniforms
    this.computeMaterial.uniforms.deltaTime.value = deltaTime;
    this.computeMaterial.uniforms.target.value.copy(this.target);

    // Ping-pong render targets
    const inputTarget = this.renderTargetA;
    const outputTarget = this.renderTargetB;

    // Run compute shader
    this.app.renderer.setRenderTarget(outputTarget);
    this.app.renderer.render(this.scene, this.camera);
    this.app.renderer.setRenderTarget(null);

    // Swap render targets
    this.renderTargetA = outputTarget;
    this.renderTargetB = inputTarget;

    // Update agent positions in the geometry
    const positions = this.agentGeometry.attributes.position.array;
    for (let i = 0; i < this.numAgents; i++) {
      const state = this.getStateFromTexture(i);
      positions[i * 4] = state[0];
      positions[i * 4 + 1] = state[1];
      positions[i * 4 + 2] = 0; // Z position remains 0 (XY plane)
    }
    this.agentGeometry.attributes.position.needsUpdate = true;
  }

  getStateFromTexture(index) {
    // Retrieve state from texture (for visualization updates)
    const x = index % this.textureSize;
    const y = Math.floor(index / this.textureSize);
    const uv = new THREE.Vector2(x / this.textureSize, y / this.textureSize);
    return [x, y, uv];
  }

  animate = () => {
    const deltaTime = this.clock.getDelta(); // Calculate time since the last frame
    this.update(deltaTime); // Update the steering behaviors
    this.app.renderer.render(this.scene, this.camera); // Render the scene
    requestAnimationFrame(() => this.animate()); // Loop the animation
  }
}
