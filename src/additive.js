import * as THREE from 'https://threejs.org/build/three.module.js';

class Additive {

    scene;
    nodes;
    frame;
    step;
    camera;
    renderer;

    constructor(c) {
        this.scene = new THREE.Scene();
        this.nodes = [];
        this.frame = 0;
        this.step = 3;
        
        let container = c;

        const fov = 35;
        const aspect = container.offsetWidth / container.offsetHeight;
        const near = 0.1;
        const far = 100;
        
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far); //maybe use OrthographicCamera for 2d scenes or user interfaces?
        this.camera.position.set(0,0,10);
        
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        container.append(this.renderer.domElement);
    }

    setup() {
        this.updateCircle(12);
    }

    updateCircle(sides) {

        this.scene.remove.apply(this.scene, this.scene.children);
        this.nodes = [];
        this.frame = 0;
        let geometry = new THREE.CircleGeometry(2, sides, Math.PI/2);
        console.log(geometry);
        const material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
        let circle = new THREE.Mesh(geometry, material);
        console.log(circle);
        for (let i=1;i<=sides;i++) {
            this.makeNode(circle, geometry.attributes.position.array.slice(3*i, 3*i+3), i);
        }
        this.renderer.render(this.scene, this.camera);
        console.log(geometry.vertices);
    }

    makeNode(parent, vector, index) {
        let geometry = new THREE.CircleGeometry(0.1,12);
        let material = new THREE.MeshBasicMaterial({color:0xf0f0f0});
        let node = new THREE.Mesh(geometry, material);
        this.nodes.unshift(node);
        node.position.set(vector[0], vector[1], vector[2]);
        node.parent = parent;
        this.scene.add(node);
        console.log(`node ${index} added`);
    }
    
}

export {Additive};
// export default Additive;