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
