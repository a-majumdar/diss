import { Modular } from './mod.js';
import * as THREE from 'https://threejs.org/build/three.module.js';
import './common.js';


class Multiplicative extends Modular {

    node;

    constructor(c) {

        super(c);

    }

    updateCircle(sides) {

        super.updateCircle(sides);
        this.node = 1;

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

    updateLabels() {
        document.getElementById('n').innerHTML = this.size;
        document.getElementById('sums').innerHTML = ``;
    }

    tick() {
        this.node = (this.step * this.node) % this.size;
        super.tick(this.node);
        if (this.node == 1) { this.mInverse(); }
        this.updateLabels();

        this.sumLabel();

    }

    sumLabel() {
        document.getElementById('sums').innerHTML = `${this.step} ^ ${this.counter+1} = ${this.step^(this.counter + 1)} = ${this.node} (mod ${this.size})`;
    }

    updateLabels() {
        document.getElementById('n').innerHTML = this.size;
        document.getElementById('sums').innerHTML = ``;
    }


}

export {Multiplicative};