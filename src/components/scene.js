import { Color, Scene } from 'https://threejs.org/build/three.module.js';

function createScene() {

    const scene = new Scene();

    scene.background = new Color('black');

    return scene;
}

export { createScene };