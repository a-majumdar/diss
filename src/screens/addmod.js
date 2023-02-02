import * as THREE from 'https://threejs.org/build/three.module.js';
import { SkeletonHelper } from 'three';
import { Loop } from '../systems/loop.js';
// import * as FontLoader from '../three.js-master/examples/js/loaders/FontLoader.js';
// import { FontLoader } from 'https://threejs.org/examples/jsm/loaders/FontLoader.js';
// import { TextGeometry } from 'https://threejs.org/examples/jsm/geometries/TextGeometry.js';
// import * as FontLoader from 'https://threejs.org/examples/jsm/loaders/FontLoader.js';
// import * as FontLoader from 'fontloader';
// import {Common} from './common.js';
import {Screen} from './screen.js';

class Addmod extends Screen {

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
        document.getElementById('stepCount').innerHTML = "";

        let geometry = new THREE.CircleGeometry(2, sides, Math.PI/2);
        // console.log(geometry);
        const material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
        let circle = new THREE.Mesh(geometry, material);
        // console.log(circle);
        // this.makeNode(circle, [0,2.1,0]); 
        // this.nodes[0].material.color.setHex(0xf0ff0f);
        // console.log(this.nodes[0]);
        this.indicatorNode();

        for (let i=1;i<=sides;i++) {
            this.makeNode(circle, geometry.attributes.position.array.slice(3*i, 3*i+3));
        }
        let first = this.nodes.pop();
        this.nodes.unshift(first);
        this.nodes[this.step].material.color.set('blue');
        // this.nodes[0].material.color.setHex(`0x00ff00`);
        // this.loop.updatables.push(this.nodes);
        this.renderer.render(this.scene, this.camera);
        // console.log(geometry.vertices);

    }

    indicatorNode() {

        let direction = new THREE.Vector3(0,-1,0);
        let origin = new THREE.Vector3(0,2.3,0);
        let length = 0.2;
        let headLength = 0.07;
        let headWidth = 0.1;
        let colour = 0xf0ff0f;

        const indicator = new THREE.ArrowHelper(direction, origin, length, colour, headLength, headWidth);
        this.scene.add(indicator);

    }

    makeNode(parent, vector) {
        let geometry = new THREE.CircleGeometry(0.05,12);
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
        // console.log(this.step);
        this.nodes[this.step].material.color.set('blue');
        this.renderer.render(this.scene, this.camera);

        // console.log(this.nodes[this.step].material.color);
        this.counter = 0;
        this.updateLabels();
        document.getElementById('mInverse').innerHTML = "";
        document.getElementById('stepCount').innerHTML = "";
    }

    tick() {
        // console.log(`animating frame ${this.counter}`);
        if (this.counter < this.size) {
            let node = this.step * (this.counter + 1);
            node = node >= this.size ? node % this.size : node;
            this.tail.unshift(node);
            // console.log(this.tail);
            if (node == 1) { this.mInverse(); }
            this.changeColours();
            this.renderer.render(this.scene, this.camera);
            this.updateLabels();
            this.sumLabel(node);
            this.counter += 1;
            this.renderer.render(this.scene, this.camera);

        }
        else {
            this.loop.stop();
        }
    }

    sumLabel(current) {
        document.getElementById('sums').innerHTML = `${this.step} x ${this.counter+1} = ${this.step*(this.counter + 1)} = ${current} (mod ${this.size})`;
    }

    mInverse() {
        document.getElementById('mInverse').innerHTML = `The multiplicative inverse of ${this.step} in Z_${this.size} is ${this.counter+1}`;
        this.nodes[1].material.color.setHex('0x0f0f0f');
    }

    updateLabels() {
        document.getElementById('n').innerHTML = this.size;
        document.getElementById('iSlider').setAttribute("max", this.size-1);
        document.getElementById('iMax').innerHTML = `The maximum value for i is: ${document.getElementById('iSlider').getAttribute("max")}`;
        document.getElementById('i').innerHTML = `The current step size is ${this.step}`;
        document.getElementById('counterLabel').innerHTML = `Currently viewing step ${this.counter+1}`;
        document.getElementById('sums').innerHTML = ``;
    }

    changeColours() {
        for (let i = 0; i < this.tail.length; i++) {
            let hue = i*25 > 175 ? 'af' : this.charPairs[i*25];
            this.nodes[this.tail[i]].material.color.setHex(`0xff${hue+hue}`);
        }
    }

    // playSpeed(value) {
    //     this.speed = 3000 / value;
    // }
    

}

export {Addmod};