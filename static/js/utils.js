// Time management class
export class TimeManager {
    constructor(timeStep = 0.016, maxAccumulatedTime = 0.25) {
        this.timeStep = timeStep; // Fixed time step (16ms for ~60 updates/sec)
        this.maxAccumulatedTime = maxAccumulatedTime; // Prevent spiral of death
        this.accumulator = 0;
        this.lastTime = performance.now();
    }

    // Calculates delta time and accumulates
    update() {
        const currentTime = performance.now();
        const frameTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = currentTime;

        // Clamp frame time to avoid large jumps
        this.accumulator += Math.min(frameTime, this.maxAccumulatedTime);
    }

    // Advances the simulation steps and returns the number of steps to process
    needsUpdate() {
        return this.accumulator >= this.timeStep;
    }

    step() {
        this.accumulator -= this.timeStep;
        return this.timeStep;
    }

    // Optional: Get interpolation factor for rendering
    getInterpolationFactor() {
        return this.accumulator / this.timeStep;
    }
}

// Utility to load a shader from a file
export async function loadShader(url) {
    const basePath =  window.location.origin + '/CSWebPortfolio/static/assets/shaders/';
    try {
        const response = await fetch(basePath + url);
        if (!response.ok) {
            throw new Error(`Failed to load shader at ${url}: ${response.statusText}`);
        }
        return await response.text();
    } catch (error) {
        console.error(`Error in loadShader: ${error}`);
        throw error; // Re-throw to let calling functions handle it
    }
}

// Utility to load multiple shaders concurrently
export async function loadShaders(shaderPaths) {
    try {
        const shaderPromises = shaderPaths.map(path => loadShader(path));
        const shaders = await Promise.all(shaderPromises);
        return shaders;
    } catch (error) {
        console.error(`Error in loadShaders: ${error}`);
        throw error; // Re-throw to let calling functions handle it
    }
}

// Example usage to preload shaders
export async function preloadShaders() {
    const basePath = window.location.origin + '/CSWebPortfolio/static/assets/shaders/';
    const shaderPaths = {
        cubeVertex: `${basePath}cubeVertex.txt`,
        cubeFragment: `${basePath}cubeFragment.txt`,
    };

    try {
        const [cubeVertex, cubeFragment] = await loadShaders(Object.values(shaderPaths));
        return { cubeVertex, cubeFragment };
    } catch (error) {
        console.error('Error in preloadShaders:', error);
        throw error; // Re-throw to let calling functions handle it
    }
}
