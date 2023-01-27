import * as THREE from 'https://threejs.org/build/three.module.js';

function createRenderer() {

    const renderer = new THREE.WebGLRenderer();

    return renderer;
}

export { createRenderer };