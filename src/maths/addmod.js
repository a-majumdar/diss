import * as THREE from 'https://threejs.org/build/three.module.js';
// import { SkeletonHelper } from 'three';
// import { Loop } from '../systems/loop.js';
// import * as FontLoader from '../three.js-master/examples/js/loaders/FontLoader.js';
// import { FontLoader } from 'https://threejs.org/examples/jsm/loaders/FontLoader.js';
// import { TextGeometry } from 'https://threejs.org/examples/jsm/geometries/TextGeometry.js';
// import * as FontLoader from 'https://threejs.org/examples/jsm/loaders/FontLoader.js';
// import * as FontLoader from 'fontloader';
// import {Common} from './common.js';
// import {Screen} from '../screens/screen.js';
import { Modular } from './mod.js';

class Addmod extends Modular {

    node;

    constructor(c) {

        super(c);
        this.node = 0;
    }

    updateCircle(sides) {

        super.updateCircle(sides);
        document.getElementById('sums').innerHTML = "placeholder";

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
        this.node = (this.step*(this.counter + 1)) % this.size; //fix off by two weirdness
        // this.node = this.node >= this.size ? this.node % this.size : this.node;
        super.tick(this.node);
        if (this.node == 1) { this.mInverse(); }
        this.updateLabels();

        this.sumLabel();

    }

    sumLabel() {
        document.getElementById('sums').innerHTML = `${this.step} x ${this.counter+1} = ${this.step*(this.counter + 1)} = ${this.node} (mod ${this.size})`;
    }

    mInverse() {

        document.getElementById('mInverse').innerHTML = `The multiplicative inverse of ${this.step} in Z_${this.size} is ${this.counter+1}`;
        this.nodes[1].material.color.setHex('0x00ff0f');
        this.renderer.render(this.scene, this.camera);

    }

    updateLabels() {
        document.getElementById('n').innerHTML = this.size;
        // document.getElementById('iSlider').setAttribute("max", this.size-1);
        // document.getElementById('iMax').innerHTML = `The maximum value for i is: ${document.getElementById('iSlider').getAttribute("max")}`;
        // document.getElementById('counterLabel').innerHTML = `Currently viewing step ${this.counter+1}`;
        document.getElementById('sums').innerHTML = ``;
    }

}

export {Addmod};