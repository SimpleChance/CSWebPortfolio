// spinningCube.js
import * as THREE from 'three';

export default class SpinningCubeDemo {
    constructor(app, shaders) {
        this.app = app;
        this.shaders = shaders;
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
        // Create geometry and ShaderMaterial
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.ShaderMaterial({
            vertexShader: this.shaders.vertexShader,
            fragmentShader: this.shaders.fragmentShader,
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

        this.scene.background = new THREE.Color(0xf9f9f9);

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
        if (this.app.currentDemo !== this) return;

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
