import {Screen} from '../screens/screen.js';
import * as THREE from 'https://threejs.org/build/three.module.js';
import {Node} from "../components/node.js";
//import * as Screen1 from '../screens/screen1.js';


class Modular extends Screen {

    size;
    tail;
    characters = '0123456789abcdef';
    charPairs = [];
    nodes;
    speed = 1000;

    constructor(c) {

        super(c);
        this.generateCharPairs();

    }

    generateCharPairs() {

        for (let i = 0; i < this.characters.length; i++) {
            for (let j = 0; j < this.characters.length; j++) {
                this.charPairs.push(`${this.characters[i] + this.characters[j]}`);
            }
        }

    }

    setup() {

        let startN = document.getElementById('nSlider').value;
        this.updateCircle(startN);

    }

    updateCircle(sides) {

        this.scene.remove.apply(this.scene, this.scene.children);
        this.nodes = [];
        this.tail = [];
        this.counter = 0;
        this.size = sides;
        this.updateLabels();
        // this.addLabels();
        document.getElementById('mInverse').innerHTML = "";

        let geometry = new THREE.CircleGeometry(2, sides, Math.PI/2);
        // console.log(geometry);
        const material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
        let circle = new THREE.Mesh(geometry, material);
        // console.log(circle);
        // this.makeNode(circle, [0,2.1,0]); 
        // this.nodes[0].material.color.setHex(0xf0ff0f);
        // console.log(this.nodes[0]);
        // this.indicatorNode();
        this.zeroIndicator();

        for (let i=1;i<=sides;i++) {
            this.makeNode(i, circle, geometry.attributes.position.array.slice(3*i, 3*i+3));
        }
        let first = this.nodes.pop();
        this.nodes.unshift(first);
        for (let i = 0; i < this.size; i++) {
            this.nodes[i].changeIndex(i);
        }
        // this.nodes[0].material.color.setHex(`0x00ff00`);
        // this.loop.updatables.push(this.nodes);
        this.renderer.render(this.scene, this.camera);
        // console.log(geometry.vertices);

    }

    zeroIndicator() {

        let direction = new THREE.Vector3(0,-1,0);
        let origin = new THREE.Vector3(0,2.3,0);
        let length = 0.2;
        let headLength = 0.07;
        let headWidth = 0.1;
        let colour = 0xf0ff0f;

        const indicator = new THREE.ArrowHelper(direction, origin, length, colour, headLength, headWidth);
        this.scene.add(indicator);

    }

    makeNode(i, parent, vector) {
        let node = new Node(vector, i, this.size);
        this.nodes.unshift(node);
        node.parent = parent;
        this.scene.add(node.object);
        // console.log(`node ${index} added`);
        return node;
    }

    tick(node) {
        // console.log(`animating frame ${this.counter}`);

        if (this.counter < this.size && !this.tail.includes(node)) {
            this.tail.unshift(node);
            // if (node == 1) { this.mInverse(); }
            this.changeColours();
            // this.updateLabels();
            // this.sumLabel(node);
            this.counter += 1;
            this.renderer.render(this.scene, this.camera);
        }
        else {
            this.loop.stop();
            this.finished();
            // if (typeof this == Screen1) { document.getElementById('gcd').innerHTML = common.gcd(this.size, this.step) == 1 ? `${this.size} and ${this.step} are coprime` : `The greatest common divisor of ${this.size} and ${this.step} is ${common.gcd(this.size, this.step)}`; }
        }

        // return node;
    }

    finished() {

    }

    changeColours() {

        for (let i = this.tail.length-1; i >= 0; i--) {
            let hue = i*25 > 175 ? 'af' : this.charPairs[i*25];
            this.nodes[this.tail[i]].colour(`0xff${hue+hue}`);
        }
    }


}

export {Modular};