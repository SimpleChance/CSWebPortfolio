// main.js
import * as THREE from 'three';
import { loadShader } from './utils.js';
import SpinningCubeDemo from './demos/spinningCube.js';

class DemoApp {
    constructor(canvasId) {
        this.canvasId = canvasId;
        this.canvas = document.getElementById(canvasId);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

        this.currentDemo = null;
        this.shaders = {}; // Store preloaded shaders
        this.init();
    }

    async init() {
        // Preload shaders
        this.shaders.vertexShader = await loadShader('cubeVertex.txt');
        this.shaders.fragmentShader = await loadShader('cubeFragment.txt');

        this.setupDemoButtons();
        this.setupResizeListener();

        console.log('main.js: DemoApp Initialized');
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
            console.log('main.js: Window Resized');
            if (this.currentDemo){
                this.resizeCanvasToDisplaySize();
                this.currentDemo.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
                this.currentDemo.camera.updateProjectionMatrix();
            }
        });
    }

    resizeCanvasToDisplaySize() {
        const width = window.innerWidth * 0.8;
        const height = window.innerHeight * 0.8;

        // Update the internal drawing buffer size
        if (this.canvas.style.width !== width || this.canvas.style.height != height) {
            this.canvas.width = width;
            this.canvas.height = height;
            this.canvas.style.width = `${width}px`;
            this.canvas.style.height = `${height}px`;
            this.renderer.setSize(width, height, false);
            console.log("main.js: Canvas resized:", this.canvas.clientWidth, this.canvas.clientHeight);
        }
    }

    async loadDemo(demoName) {
        if (this.currentDemo) {
            this.currentDemo.dispose();
        }

        switch (demoName) {
            case 'spinningCube':
                this.currentDemo = new SpinningCubeDemo(this, this.shaders);
                break;
            default:
                console.error(`Demo "${demoName}" not found.`);
                return;
        }

        await this.currentDemo.init();
        console.log('main.js: Demo Loaded');
    }
}

const app = new DemoApp('three-canvas');
