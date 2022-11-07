import * as THREE from 'https://unpkg.com/three@0.108.0/build/three.module.js';

class Additive {

    constructor(container) {
        this.scene = new THREE.Scene();
        this.nodes = [];
        this.frame = 0;
        this.step = 3;
        
        this.fov = 35;
        this.aspect = container.offsetWidth / container.offsetHeight;
        this.near = 0.1;
        this.far = 100;
        
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far); //maybe use OrthographicCamera for 2d scenes or user interfaces?
        camera.position.set(0,0,10);
        
        this.contaniner = container;
        this.renderer = new THREE.WebGLRenderer();
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        container.append(renderer.domElement);
    }

    setup() {
        this.updateCircle(12);
    }

    updateCircle(sides) {

        scene.remove.apply(scene, scene.children);
        nodes = [];
        frame = 0;
        let geometry = new THREE.CircleGeometry(2, sides, Math.PI/2);
        const material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
        let circle = new THREE.Mesh(geometry, material);
        for (let i=1;i<=sides;i++) {
            makeNode(circle, geometry.vertices[i], i);
        }
        renderer.render(scene, camera);
        console.log(geometry.vertices);
    }

    makeNode(parent, vector, index) {
        let geometry = new THREE.CircleGeometry(0.1,12);
        let material = new THREE.MeshBasicMaterial({color:0xf0f0f0});
        let node = new THREE.Mesh(geometry, material);
        nodes.unshift(node);
        node.position.set(vector.x, vector.y, vector.z);
        node.parent = parent;
        scene.add(node);
        console.log(`node ${index} added`);
    }
    
}

export default Additive;