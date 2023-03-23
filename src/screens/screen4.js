import { Multiplicative } from "../maths/multiplicative.js";
import {Common} from "../maths/common.js";
import * as THREE from 'https://threejs.org/build/three.module.js';
import {Node} from "../components/node.js";


const container = document.getElementById('scene-container');
var screen4;
const common = new Common();
// indicators;

class Screen4 extends Multiplicative {

    flag;
    shades;
    ring;
    state = {
        node: 0,
        step: 1,
        size: this.size
    };
    jump;

    constructor(c) {
        super(c);
        this.setup();
        this.flag = true;
        this.ring = [];
        this.jump = 1;
    }

    updateCircle(sides) {
        super.updateCircle(sides);
        this.loop.stop();
        document.getElementById('eqn').innerHTML = "";
        document.getElementById('totient').innerHTML = "";
    }

    updateLabels() {
        super.updateLabels();

    }

    cycle() {
        let geometry = new THREE.CircleGeometry(1.8, this.size, Math.PI/2);
        const material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
        let circle = new THREE.Mesh(geometry, material);
        this.shades = this.shading();

        for (let i=0; i < this.size; i++) {
            this.tick();
            let index = 3 * (i + 1);
            let n = this.makeNode(circle, geometry.attributes.position.array.slice(index, index+3));
            let shade = shades[i];
            n.colour(`0x${shade+shade+shade}`);
            this.renderer.render(this.scene, this.camera);
            this.flag = false;
        }
    }
    
    orders() {
        let geometry = new THREE.CircleGeometry(1.8, this.size, Math.PI/2);
        const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        let circle = new THREE.Mesh(geometry, material);
        for (let i=0; i < this.size; i++) {
            let index = 3 * (i + 1);
            this.ring[i] = this.makeRingNode(i, circle, geometry.attributes.position.array.slice(index, index+3));
        }
        let first = this.ring.pop();
        this.ring.unshift(first);
        for (let i = 0; i < this.size; i++) {
            this.ring[i].changeIndex(i);
        }
        this.loop.start(this);
    }

    makeRingNode(i, parent, vector) {
        let node = new Node(vector, i, this.size);
        this.ring.unshift(node);
        node.parent = parent;
        this.scene.add(node.object);
        return node;
    }

    tick() {
        if (this.counter < this.size && !this.tail.includes(this.counter)) {
            this.tail.unshift(this.counter);
            this.ring[this.counter].colour(common.orderColour(this.size, this.ring[this.counter].index));
            this.counter += 1;
            this.renderer.render(this.scene, this.camera);
            document.getElementById('eqn').innerHTML = `Order(${this.size},${this.counter}) = n / gcd(${this.size},${this.counter}) 
            = ${this.size} / ${common.gcd(this.size, this.counter)} 
            = ${this.size / (common.gcd(this.size, this.counter))}`;

        }
        else {
            this.loop.stop();
            document.getElementById('totient').innerHTML = `phi(${this.size}) = ${common.totient(this.size)}`;
        }
    }

    shading() {

        let factors = common.factors(this.size);
        let shadediff = 255/this.size;
        // console.log(shadediff);
        let orders = this.findOrder(this.size);
        // console.log(orders);
        let ordershade = [];
        for (let i = 0; i <= this.size; i++) {
            ordershade[i] = this.charPairs[Math.floor(shadediff * orders[i])];
            // console.log(factors[i], this.charPairs[shadediff * i]);
        }
        // console.log(factorindicies);
        // console.log(shades);
        console.log(ordershade);
        return ordershade;

    }

    jump() {

        for (let i=0; i < this.size; i++) {
            if (this.counter < this.size && !this.tail.includes(this.counter)) {
                this.tail.unshift(this.counter);
                super.tick((this.jump*(i + 1)) % this.size);
                // console.log(shade);
            }
        }
        this.ring[this.counter].colour(`0x${shade+shade+shade}`);
        this.counter += 1;
        this.renderer.render(this.scene, this.camera);
        this.jump++;

    }

}

function main() {
    screen4 = new Screen4(container);
}

var slider = document.getElementById('nSlider');
slider.oninput = function() {
    let sides = slider.value;
    screen4.updateCircle(sides);
    screen4.stepSize(1);
}

var nbtn = document.getElementById('nxtBtn');
nbtn.onclick = function() {
    screen4.jump();
}

var pbtn = document.getElementById('playBtn');
pbtn.onclick = function() {
    screen4.orders();
    // screen4.cycle();
}

var reset = document.getElementById('Reset');
reset.onclick = function() { refresh(); }

function refresh() {
    screen4.loop.stop();
    screen4.updateCircle(slider.value);
}

main();