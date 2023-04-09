import { Multiplicative } from "../maths/multiplicative.js";
import {Common} from "../maths/common.js";
import * as THREE from 'https://threejs.org/build/three.module.js';
import {Node} from "../components/node.js";


const container = document.getElementById('scene-container');
var screen4;
const common = new Common();
// indicators;

class Screen4 extends Multiplicative {
    ring;
    buttons = {
        step: false,
        play: false,
        pause: false
    };
    stop;
    interval;

    constructor(c) {
        super(c);
        this.setup();
        this.ring = [];
        this.step = 1;
    }

    tick() {
        if (this.buttons.step) { this.steps(); }
        else if (this.buttons.play) { this.otick(); }
    }

    steps() {
        this.tail = [];
        for (let i = 0; i < this.size; i++) { this.nodes[i].colour(0xffffff); }

        this.counter = 0;
        this.interval = setInterval(() => { this.rr() }, 100);
    }

    rr() {
        let node = (this.step * (this.counter + 1)) % this.size;
        if (this.counter < this.size && !this.tail.includes(node)) {
            this.tail.unshift(node);
            this.changeColours();
            this.renderer.render(this.scene, this.camera);
            this.counter++;
        }
        else {
            clearInterval(this.interval);
            this.onode();
            this.step++;
        }
    }

    onode() {
        let index = 3 * (this.size - this.step + 1);
        let [circle, geometry] = this.innerCircle();
        this.ring[this.step] = this.makeRingNode(this.step, circle, geometry.attributes.position.array.slice(index, index+3));
        // this.ring[this.step].changeIndex(this.size - this.step);
        this.ring[this.step].colour(common.multiplicativeOrders(this.size, this.ring[this.step].index));
        this.renderer.render(this.scene, this.camera);
        let temp = common.multiplicativeOrders(this.size, this.step);
        let colourString = '#' + temp.substring(2);
        document.getElementById('eqn').innerHTML = `Order(${this.size},${this.step}) = n / gcd(${this.size},${this.step}) 
        = ${this.size} / ${common.gcd(this.size, this.step)} 
        = ${this.size / (common.gcd(this.size, this.step))} <span style="color:${colourString};font-size:50px">&#149;</span>`;
        document.getElementById('gcd').innerHTML = `gcd(${this.size},${this.step}) = ${common.gcd(this.step, this.size)}`;
        document.getElementById('totient').innerHTML = `phi(n) = ${common.totient(this.size)}`;
        document.getElementById('order').innerHTML = `order(${this.size},${this.step}) = ${this.size / common.gcd(this.step, this.size)}`;

    }

    otick() {
        if (this.counter < this.size) {
            this.tail.unshift(this.counter);
            this.ring[this.counter].colour(common.multiplicativeOrders(this.size, this.ring[this.counter].index));
            // console.log();
            let temp = common.multiplicativeOrders(this.size, this.ring[this.counter].index);
            let colourString = '#' + temp.substring(2);
            console.log(colourString);
            document.getElementById('eqn').innerHTML = `Order(${this.size},${this.counter}) = n / gcd(${this.size},${this.counter}) 
            = ${this.size} / ${common.gcd(this.size, this.counter)} 
            = ${this.size / (common.gcd(this.size, this.counter))} <span style="color:${colourString};font-size:50px">&#149;</span>`;
            this.counter += 1;
            this.renderer.render(this.scene, this.camera);
            document.getElementById('gcd').innerHTML = `gcd(${this.size},${this.counter}) = ${common.gcd(this.counter, this.size)}`;
            document.getElementById('totient').innerHTML = `phi(n) = ${common.totient(this.size)}`;
            document.getElementById('order').innerHTML = `order(${this.size},${this.counter}) = ${this.size / common.gcd(this.counter, this.size)}`;
        }
        else {
            this.buttons.play = false;
            this.loop.stop();
            document.getElementById('totient').innerHTML = `phi(${this.size}) = ${common.totient(this.size)}`;
        }
    }

    orders() {
        let [circle, geometry] = this.innerCircle();
        for (let i = 0; i < this.size; i++) {
            let index = 3 * (i + 1);
            this.ring[i] = this.makeRingNode(i, circle, geometry.attributes.position.array.slice(index, index+3));
        }
        let first = this.ring.pop();
        this.ring.unshift(first);
        for (let i = 0; i < this.size; i++) {
            this.ring[i].changeIndex(i);
        }
        this.loop.start(this, 300);
    }

    innerCircle() {
        let geometry = new THREE.CircleGeometry(1.8, this.size, Math.PI/2);
        const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        let circle = new THREE.Mesh(geometry, material);
        return [circle, geometry];
    }

    makeRingNode(i, parent, vector) {
        if (common.gcd(this.size, i) != 1) {
            return new Node(vector, i, this.size, 0x000000);
        }
        let node = new Node(vector, i, this.size);
        this.ring.unshift(node);
        node.parent = parent;
        this.scene.add(node.object);
        return node;
    }

    updateCircle(sides) {
        super.updateCircle(sides);
        // document.getElementById('stepCount').innerHTML = "";
        this.loop.stop();
        document.getElementById('eqn').innerHTML = "";
        document.getElementById('totient').innerHTML = "";
        for (let i = 0; i < this.size; i++) {
            if (common.gcd(this.size, i) != 1) {
                this.nodes[i].colour(0xf0f0f0);
            }
        }
        this.renderer.render(this.scene, this.camera);
        
    }

    updateLabels() {
        super.updateLabels();

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
    // document.getElementById('playBtn').style.visibility = "hidden";
    screen4.buttons.step = true;
    if (screen4.buttons.play) {
        screen4.loop.stop();
        screen4.buttons.play = false;
        screen4.stepSize(1);
    }
    screen4.tick();
}

var pbtn = document.getElementById('playBtn');
pbtn.onclick = function() {
    // document.getElementById('nxtBtn').style.visibility = "hidden";
    screen4.buttons.play = true;
    if (screen4.buttons.step) {
        screen4.buttons.step = false;
        screen4.counter = screen4.step;
    }
    screen4.orders();
    // screen4.cycle();
}

var reset = document.getElementById('Reset');
reset.onclick = function() { refresh(); }

function refresh() {
    document.getElementById('playBtn').style.visibility = "visible";
    screen4.buttons.play = false;
    screen4.loop.stop();
    document.getElementById('nxtBtn').style.visibility = "visible";
    screen4.buttons.step = false;
    // screen4.loop.stop();
    screen4.updateCircle(slider.value);
    screen4.step = 1;
}

main();