import * as THREE from 'https://threejs.org/build/three.module.js';

class Additive {

    scene;
    nodes;
    counter;
    step;
    camera;
    renderer;
    size;
    tail;
    characters = '0123456789abcdef';
    charPairs = [];

    constructor(c) {
        this.generateCharPairs();
        this.scene = new THREE.Scene();
        this.nodes = [];
        this.counter = 0;
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

    generateCharPairs() {
        for (let i = 0; i < this.characters.length; i++) {
            for (let j = 0; j < this.characters.length; j++) {
                this.charPairs.push(`${this.characters[i] + this.characters[j]}`);
            }
        }
    }

    setup() {
        this.updateCircle(12);
        this.size = 12;
        this.counter = 0;
    }

    updateCircle(sides) {
        this.scene.remove.apply(this.scene, this.scene.children);
        this.nodes = [];
        this.tail = [];
        this.counter = 0;
        this.size = sides;
        this.updateLabels();
        document.getElementById('mInverse').innerHTML = "";
        document.getElementById('stepCount').innerHTML = "";

        let geometry = new THREE.CircleGeometry(2, sides, Math.PI/2);
        // console.log(geometry);
        const material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
        let circle = new THREE.Mesh(geometry, material);
        // console.log(circle);
        for (let i=1;i<=sides;i++) {
            this.makeNode(circle, geometry.attributes.position.array.slice(3*i, 3*i+3), i);
        }
        this.renderer.render(this.scene, this.camera);
        // console.log(geometry.vertices);
    }

    makeNode(parent, vector, index) {
        let geometry = new THREE.CircleGeometry(0.1,12);
        let material = new THREE.MeshBasicMaterial({color:0xf0f0f0});
        let node = new THREE.Mesh(geometry, material);
        this.nodes.unshift(node);
        node.position.set(vector[0], vector[1], vector[2]);
        node.parent = parent;
        this.scene.add(node);
        // console.log(`node ${index} added`);
    }
    
    stepSize(sliderValue) {
        this.step = sliderValue;
        this.updateCircle(this.size);
        this.counter = 0;
        this.updateLabels();
        document.getElementById('mInverse').innerHTML = "";
        document.getElementById('stepCount').innerHTML = "";
    }

    animate() {
        // console.log(`animating frame ${this.counter}`);
        let node = this.step * (this.counter + 1);
        node = node >= this.size ? node % this.size : node;
        this.tail.unshift(node);
        console.log(this.tail);
        if (node == 1) { this.mInverse(); }
        this.changeColours();
        this.renderer.render(this.scene, this.camera);
        this.updateLabels();
        this.counter += 1;
    }

    mInverse() {
        document.getElementById('mInverse').innerHTML = `The multiplicative inverse of ${this.step} in Z_${this.size} is ${this.counter+1}`;
    }

    updateLabels() {
        document.getElementById('n').innerHTML = this.size;
        document.getElementById('iSlider').setAttribute("max", this.size-1);
        document.getElementById('iMax').innerHTML = `The maximum value for i is: ${document.getElementById('iSlider').getAttribute("max")}`;
        document.getElementById('i').innerHTML = `The current step size is ${this.step}`;
        document.getElementById('counterLabel').innerHTML = `Currently viewing step ${this.counter+1}`;
    }

    changeColours() {
        for (let i = 0; i < this.tail.length; i++) {
            let hue = i*25 > 175 ? 'af' : this.charPairs[i*25];
            // console.log(hue);
            this.nodes[this.tail[i]].material.color.setHex(`0xff${hue+hue}`);
        }
    }
    

}

export {Additive};
// export default Additive;