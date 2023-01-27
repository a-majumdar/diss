import * as THREE from 'https://threejs.org/build/three.module.js';

class Screen {

    scene;
    nodes;
    counter;
    step;
    container;
    camera;
    renderer;

    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();

    constructor(c) {
        this.scene = new THREE.Scene();
        this.nodes = [];
        this.counter = 0;
        this.step = 1;
        
        let container = c;

        const fov = 35;
        const aspect = container.offsetWidth / container.offsetHeight;
        const near = 0.1;
        const far = 100;
        
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far); //maybe use OrthographicCamera for 2d scenes or user interfaces?
        this.camera.position.set(0,0,10);
        
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        // this.renderer.setSize(window.innerWidth * 0.60, window.innerHeight * 0.75);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        container.append(this.renderer.domElement);
    }

    intersect(position) {
        this.raycaster.setFromCamera(position, this.camera);
        return this.raycaster.intersectObjects(this.scene.children);
    }
}

export {Screen};