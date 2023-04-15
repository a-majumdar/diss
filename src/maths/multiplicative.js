import { Modular } from './mod.js';
import * as THREE from 'https://threejs.org/build/three.module.js';
import {Common} from './common.js';
import {Node} from "../components/node.js";


class Multiplicative extends Modular {

    node;
    common = new Common();

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
        this.nodes[this.step].colour('0x0000ff');
        this.renderer.render(this.scene, this.camera);

        // console.log(this.nodes[this.step].material.color);
        this.counter = 1;
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
        if (this.counter <= (this.common.totient(this.size) + 1)) {
            console.log(this.counter, this.node);
            this.tail.unshift(this.node);
            super.changeColours();
            // this.counter += 1;
            this.renderer.render(this.scene, this.camera);
            this.sumLabel();
        }
        else {
            this.loop.stop();
            this.finished();
        }

        //super.tick(this.node);
        if (this.node == 1) {
            this.renderer.render(this.scene, this.camera);
            this.sumLabel();
        }
        this.updateLabels();


    }

    sumLabel() {
        document.getElementById('sums').innerHTML = `${this.step} ^ ${this.counter} = ${this.node} (mod ${this.size})`;
    }

    updateLabels() {
        document.getElementById('n').innerHTML = this.size;
        document.getElementById('sums').innerHTML = ``;
    }


}

export {Multiplicative};