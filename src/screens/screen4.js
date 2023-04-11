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
    multiplicatives;
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
        console.log("tick", this.counter, this.step);
        if (this.buttons.step) { this.steps(); }
        else if (this.buttons.play) { this.otick(); }
    }

    steps() {
        this.tail = [];
        for (let i = 0; i < this.multiplicatives.length; i++) { this.nodes[i].colour(0xffffff); }

        this.counter = 0;
        this.interval = setInterval(() => { this.rr() }, 100);
    }

    rr() {
        let node = (this.step * (this.counter + 1)) % this.multiplicatives.length; // change to call that index in the list of multiplicatives
        node = this.multiplicatives[node];
        if (this.counter < this.multiplicatives.length && !this.tail.includes(node)) {
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
        this.ring[this.step].colour(common.findEquivOrder(this.size, this.ring[this.step].index));
        this.renderer.render(this.scene, this.camera);
        let temp = common.findEquivOrder(this.size, this.step);
        let colourString = '#' + temp.substring(2);
        document.getElementById('eqn').innerHTML = `Order(${this.size},${this.step}) = n / gcd(${this.size},${this.step}) 
        = ${this.size} / ${common.gcd(this.size, this.step)} 
        = ${this.size / (common.gcd(this.size, this.step))} <span style="color:${colourString};font-size:50px">&#149;</span>`;
        document.getElementById('gcd').innerHTML = `gcd(${this.size},${this.step}) = ${common.gcd(this.step, this.size)}`;
        document.getElementById('totient').innerHTML = `phi(n) = ${common.totient(this.size)}`;
        document.getElementById('order').innerHTML = `order(${this.size},${this.step}) = ${this.size / common.gcd(this.step, this.size)}`;

    }

    otick() {
        console.log("otick", this.counter, this.multiplicatives);
        if (this.counter < this.multiplicatives.length) {
            
            this.tail.unshift(this.multiplicatives[this.counter]);
            this.ring[this.multiplicatives[this.counter]].colour(common.findEquivOrder(this.size, this.ring[this.multiplicatives[this.counter]].index));
            // console.log();
            let temp = common.findEquivOrder(this.size, this.ring[this.multiplicatives[this.counter]].index);
            let colourString = '#' + temp.substring(2);
            console.log(colourString);
            document.getElementById('eqn').innerHTML = `Order(${this.size},${this.multiplicatives[this.counter]}) = n / gcd(${this.size},${this.multiplicatives[this.counter]}) 
            = ${this.size} / ${common.gcd(this.size, this.multiplicatives[this.counter])} 
            = ${this.size / (common.gcd(this.size, this.multiplicatives[this.counter]))} <span style="color:${colourString};font-size:50px">&#149;</span>`;
            this.renderer.render(this.scene, this.camera);
            document.getElementById('gcd').innerHTML = `gcd(${this.size},${this.multiplicatives[this.counter]}) = ${common.gcd(this.multiplicatives[this.counter], this.size)}`;
            document.getElementById('totient').innerHTML = `phi(n) = ${common.totient(this.size)}`;
            document.getElementById('order').innerHTML = `order(${this.size},${this.multiplicatives[this.counter]}) = ${this.size / common.gcd(this.multiplicatives[this.counter], this.size)}`;
            this.counter += 1;
        }
        else {
            this.buttons.play = false;
            this.loop.stop();
            document.getElementById('totient').innerHTML = `phi(${this.size}) = ${common.totient(this.size)}`;
        }
    }

    orders() {
        console.log("in orders()");
        let [circle, geometry] = this.innerCircle();
        for (let i = 0; i < this.multiplicatives.length; i++) {
            let temp = this.multiplicatives[i];
            let index = 3 * temp;
            this.ring[temp] = this.makeRingNode(temp, circle, geometry.attributes.position.array.slice(index, index+3));
        }
        let first = this.ring.pop();
        this.ring.unshift(first);
        for (let i = 0; i < this.multiplicatives.length; i++) {
            this.ring[i].changeIndex(this.multiplicatives[i]);
        }
        console.log("ring nodes generated");
        this.loop.start(this, 300);
    }

    innerCircle() {
        let geometry = new THREE.CircleGeometry(1.8, this.size, Math.PI/2);
        const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        let circle = new THREE.Mesh(geometry, material);
        return [circle, geometry];
    }

    makeRingNode(i, parent, vector) {
        // if (common.gcd(this.size, i) != 1) {
        //     return new Node(vector, i, this.size, 0x000000);
        // }
        let node = new Node(vector, i, this.size);
        this.ring.unshift(node);
        node.parent = parent;
        this.scene.add(node.object);
        return node;
    }

    updateCircle(sides) {
        this.loop.stop();
        this.scene.remove.apply(this.scene, this.scene.children);
        this.nodes = [];
        this.multiplicatives = [];
        this.tail = [];
        this.ring = [];
        this.counter = 0;
        this.size = sides;
        this.updateLabels();
        document.getElementById('eqn').innerHTML = "";
        document.getElementById('totient').innerHTML = "";

        let geometry = new THREE.CircleGeometry(2, sides, Math.PI/2);
        const material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
        let circle = new THREE.Mesh(geometry, material);
        this.zeroIndicator();

        for (let i = 1; i < sides; i++) {
            if (common.gcd(sides, i) == 1) { this.multiplicatives.push(i); }
        }

        for (let i = 0; i < this.multiplicatives.length; i++) {
            let temp = this.multiplicatives[i] + 1;
            this.makeNode(temp, circle, geometry.attributes.position.array.slice(3*temp, 3*temp+3));
        }

        let first = this.nodes.pop();
        this.nodes.unshift(first);
        for (let i = 0; i < this.multiplicatives.length; i++) {
            this.nodes[i].changeIndex(this.multiplicatives[i]);
        }
        console.log(this.multiplicatives, this.nodes);

        this.renderer.render(this.scene, this.camera);
        
        //     super.updateCircle(sides);
    //     // document.getElementById('stepCount').innerHTML = "";
    //     this.loop.stop();
    //     document.getElementById('eqn').innerHTML = "";
    //     document.getElementById('totient').innerHTML = "";
    //     for (let i = 0; i < this.size; i++) {
    //         if (common.gcd(this.size, i) != 1) {
    //             this.nodes[i].colour(0xf0f0f0);
    //         }
    //     }
    //     this.renderer.render(this.scene, this.camera);
        
    }

    // updateLabels() {
    //     super.updateLabels();

    // }
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
    console.log("press play");
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