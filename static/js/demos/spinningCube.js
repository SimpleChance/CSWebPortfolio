import * as THREE from 'three';

export default class SpinningCubeDemo {
  constructor(app) {
    this.app = app;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.app.canvas.clientWidth / this.app.canvas.clientHeight, 0.1, 1000);
  }

  init() {
    this.camera.position.z = 5;
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    this.scene.add(light);

    this.animate();
  }

  animate = () => {
    if (this.app.currentDemo !== this) return;

    requestAnimationFrame(this.animate);
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.app.renderer.render(this.scene, this.camera);
  };

  dispose() {
    this.scene.clear(); // Remove all objects
  }
}
