import * as THREE from 'three';

export default class SpinningCube {
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

    this.mousePosition = new THREE.Vector2(0, 0); // Store mouse position

    console.log('spinningCube.js: Spinning Cube Constructed');
  }

  init() {
    // Inline shaders
    const vertexShader = `
        uniform vec2 uMouse; // Mouse position normalized to [-1, 1]
        uniform float uTime; // Time uniform for dynamic effects

        // Varying to pass normal to fragment shader
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
            // Rotation angles based on mouse position
            float angleX = uMouse.y * 3.14159; // Rotate around X-axis
            float angleY = uMouse.x * 3.14159; // Rotate around Y-axis

            // Rotation matrix for X-axis
            mat4 rotationX = mat4(
                1.0,  0.0,         0.0,        0.0,
                0.0,  cos(angleX), -sin(angleX), 0.0,
                0.0,  sin(angleX),  cos(angleX), 0.0,
                0.0,  0.0,         0.0,        1.0
            );

            // Rotation matrix for Y-axis
            mat4 rotationY = mat4(
                cos(angleY), 0.0, -sin(angleY), 0.0,
                0.0,         1.0, 0.0,        0.0,
                sin(angleY), 0.0, cos(angleY), 0.0,
                0.0,         0.0, 0.0,        1.0
            );

            // Apply rotations
            vec4 rotatedPosition = rotationY * rotationX * vec4(position, 1.0);

            // Calculate final position
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * rotatedPosition;

            // Pass the normal to the fragment shader
            vNormal = normal;
            vPosition = position;
        }

    `;

    const fragmentShader = `
        uniform float uTime; // Time uniform
        varying vec3 vPosition; // Vertex position passed from vertex shader
        varying vec3 vNormal;   // Normal vector for face detection

        void main() {
            // Determine which face the fragment belongs to based on the normal
            vec3 localPosition;
            if (abs(vNormal.x) > 0.99) { // Left/Right faces
                localPosition = vec3(0.0, vPosition.y, vPosition.z);
            } else if (abs(vNormal.y) > 0.99) { // Top/Bottom faces
                localPosition = vec3(vPosition.x, 0.0, vPosition.z);
            } else { // Front/Back faces
                localPosition = vec3(vPosition.x, vPosition.y, 0.0);
            }

            // Calculate radial distance from the center of the face
            float radius = length(localPosition.xyz); // Distance in 3D to the face from the cube center

            // Create a repeating sawtooth wave pattern
            float wave = fract((10.0 * radius - uTime * 2.5) / 3.0); // Sawtooth wave from 0 to 1

            // Map wave to three equal segments
            float segment = wave * 3.0; // Divide wave into three equal parts

            // Define the three colors
            vec3 color1 = vec3(0.0, 0.83, 1.0); // Candy Blue
            vec3 color2 = vec3(0.42, 0.39, 1.0); // Purple
            vec3 color3 = vec3(0.16, 0.17, 0.20); // Dark Gray

            // Interpolate between colors based on the segment
            vec3 color;
            if (segment < 1.0) {
                // Interpolate between Red and Green
                color = mix(color1, color2, segment);
            } else if (segment < 2.0) {
                // Interpolate between Green and Blue
                color = mix(color2, color3, segment - 1.0);
            } else {
                // Interpolate between Blue and Red
                color = mix(color3, color1, segment - 2.0);
            }

            // Output the final color
            gl_FragColor = vec4(color, 1.0);
        }

    `;

    // Create geometry and ShaderMaterial with inline shaders
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uMouse: { value: new THREE.Vector2(0, 0) },
        uTime: { value: 0.0 },
      },
    });

    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    // Add lighting
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    this.scene.add(light);

    this.scene.background = new THREE.Color(0xf0f0f0);

    // Add mouse event listeners
    this.addMouseListeners();

    console.log('spinningCube.js: Spinning Cube Initialized');
    this.animate();
  }

  addMouseListeners() {
    const canvas = this.app.renderer.domElement;
    canvas.addEventListener('mousemove', (event) => {
      const rect = canvas.getBoundingClientRect();
      this.mousePosition.x = (event.clientX - rect.left) / rect.width * 2 - 1; // Normalize to [-1, 1]
      this.mousePosition.y = -((event.clientY - rect.top) / rect.height * 2 - 1); // Normalize to [-1, 1]
    });
  }

  animate = () => {
    if (this.app.currentDemo !== this && this.app.currentDemo !== null) return;

    requestAnimationFrame(this.animate);

    // Update time uniform
    this.cube.material.uniforms.uTime.value = performance.now() * 0.001;
    this.cube.material.uniforms.uMouse.value = this.mousePosition;

    // Render the scene
    this.app.renderer.render(this.scene, this.camera);
  };

  dispose() {
    this.scene.clear(); // Remove all objects
    console.log('spinningCube.js: Scene Cleared');
  }
}
