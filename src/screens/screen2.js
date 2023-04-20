import { Addmod } from "../maths/addmod.js";
import {Common} from "../maths/common.js";
import * as THREE from 'https://threejs.org/build/three.module.js';
import {Node} from "../components/node.js";

const container = document.getElementById('scene-container');
var screen2;
const common = new Common();

class Screen2 extends Addmod {

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

        document.getElementById('gcd').innerHTML = '   ';
        document.getElementById('eqn').innerHTML = '   ';
        document.getElementById('order').innerHTML = '   ';

        this.counter = 0;
        if (this.step < this.size) {
            // document.getElementById('nxtBtn').disabled = true;
            // document.getElementById('playBtn').disabled = true;
            this.interval = setInterval(() => { this.rr() }, 100);
        }
        else if (this.step == this.size ) { 
            // this.counter++;
            // this.onode();
            document.getElementById('totient').innerHTML = `phi(${this.size}) = # of <span style="color:#707070;font-size:50px">&#149;</span> elements = ${common.totient(this.size)}`; 
            document.getElementById('nxtBtn').disabled = true;
            document.getElementById('playBtn').disabled = true;        

        }
        // this.interval = setInterval(() => { this.rr() }, 100);
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
            document.getElementById('nxtBtn').disabled = false;
            document.getElementById('playBtn').disabled = false;        
        }
    }

    onode() {
        let index = 3 * (this.size - this.step + 1);
        let [circle, geometry] = this.innerCircle();
        this.ring[this.step] = this.makeRingNode(this.step, circle, geometry.attributes.position.array.slice(index, index+3));
        // this.ring[this.step].changeIndex(this.size - this.step);
        this.ring[this.step].colour(common.orderColour(this.size, this.ring[this.step].index));
        this.renderer.render(this.scene, this.camera);
        let temp = common.orderColour(this.size, this.step);
        let colourString = '#' + temp.substring(2);

        // document.getElementById('eqn').innerHTML = `Order(${this.size},${this.step}) = n / gcd(${this.size},${this.step}) 
        // = ${this.size} / ${common.gcd(this.size, this.step)} 
        // = ${this.size / (common.gcd(this.size, this.step))} <span style="color:${colourString};font-size:50px">&#149;</span>`;
        document.getElementById('gcd').innerHTML = `gcd(${this.size},${this.step}) = ${common.gcd(this.step, this.size)}`;
        // document.getElementById('totient').innerHTML = `phi(n) = # of <span style="color:#707070;font-size:50px">&#149;</span> elements = ${common.totient(this.size)}`;
        document.getElementById('order').innerHTML = `order(${this.size},${this.step}) = ${this.size / common.gcd(this.step, this.size)} <span style="color:${colourString};font-size:50px">&#149;</span> `;

    }

    otick() {
        if (this.counter < this.size) {
            this.tail.unshift(this.counter);
            this.ring[this.counter].colour(common.orderColour(this.size, this.ring[this.counter].index));
            // console.log();
            let temp = common.orderColour(this.size, this.ring[this.counter].index);
            let colourString = '#' + temp.substring(2);
            console.log(colourString);
            // document.getElementById('eqn').innerHTML = `Order(${this.size},${this.counter}) = n / gcd(${this.size},${this.counter}) 
            // = ${this.size} / ${common.gcd(this.size, this.counter)} 
            // = ${this.size / (common.gcd(this.size, this.counter))} <span style="color:${colourString};font-size:50px">&#149;</span>`;
            this.counter += 1;
            this.renderer.render(this.scene, this.camera);
            document.getElementById('gcd').innerHTML = `gcd(${this.size},${this.counter}) = ${common.gcd(this.counter, this.size)}`;
            // document.getElementById('totient').innerHTML = `phi(n) = ${common.totient(this.size)}`;
            document.getElementById('order').innerHTML = `order(${this.size},${this.counter}) = ${this.size / common.gcd(this.counter, this.size)}<span style="color:${colourString};font-size:50px">&#149;</span> `;
        }
        else {
            this.buttons.play = false;
            this.loop.stop();
            document.getElementById('totient').innerHTML = `phi(${this.size}) = # of <span style="color:#707070;font-size:50px">&#149;</span> elements = ${common.totient(this.size)}`;
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

    // someOrders() {
    //     let [circle, geometry] = this.innerCircle();
    //     for (let i = this.counter; i < this.size; i++) {
    //         let index = 3 * i;
    //         this.ring[i] = this.makeRingNode(i, circle, geometry.attributes.position.array.slice(index, index+3));
    //     }
    //     let first = this.ring.pop();
    //     this.ring.unshift(first);
    //     for (let i = 0; i < this.size; i++) {
    //         this.ring[i].changeIndex(i);
    //     }
    //     this.loop.start(this, 300);
    // }

    innerCircle() {
        let geometry = new THREE.CircleGeometry(1.8, this.size, Math.PI/2);
        const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        let circle = new THREE.Mesh(geometry, material);
        return [circle, geometry];
    }

    makeRingNode(i, parent, vector) {
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
        
    }

    updateLabels() {
        super.updateLabels();

    }

    // async cycle() {

    //     // this.nodes = [];
    //     let geometry = new THREE.CircleGeometry(1.8, this.size, Math.PI/2);
    //     const material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
    //     let circle = new THREE.Mesh(geometry, material);
    //     let shades = this.shading();

    //     for (let i=0; i < this.size; i++) {
    //         this.tick();
    //         await this.loopWait();
    //         let n = this.makeNode(circle, geometry.attributes.position.array.slice(3*i, 3*i+3));
    //         let shade = shades[i];
    //         n.material.color.setHex(`0x${shade+shade+shade}`);
    //         this.renderer.render(this.scene, this.camera);
    //     }
    // }

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
}

function main() {
    screen2 = new Screen2(container);
}

var slider = document.getElementById('nSlider');
slider.oninput = function() {
    let sides = slider.value;
    screen2.updateCircle(sides);
    document.getElementById('gcd').innerHTML = '   ';
    document.getElementById('eqn').innerHTML = '   ';
    document.getElementById('order').innerHTML = '   ';
    document.getElementById('totient').innerHTML = '   ';
    screen2.stepSize(1);
    document.getElementById('nxtBtn').disabled = false;
    document.getElementById('playBtn').disabled = false;
}

var nbtn = document.getElementById('nxtBtn');
nbtn.onclick = function() {
    // document.getElementById('playBtn').style.visibility = "hidden";
    screen2.buttons.step = true;
    if (screen2.buttons.play) {
        screen2.loop.stop();
        screen2.buttons.play = false;
        screen2.stepSize(1);
    }
    document.getElementById('nxtBtn').disabled = true;
    document.getElementById('playBtn').disabled = true;
    screen2.tick();
}

var pbtn = document.getElementById('playBtn');
pbtn.onclick = function() {
    // document.getElementById('nxtBtn').style.visibility = "hidden";
    document.getElementById('nxtBtn').disabled = true;
    document.getElementById('playBtn').disabled = true;

    screen2.buttons.play = true;
    if (screen2.buttons.step) {
        screen2.buttons.step = false;
        screen2.counter = screen2.step;
        // screen2.someOrders();
    }
    // else { screen2.orders(); }
    screen2.orders();
    // screen2.cycle();
}

var reset = document.getElementById('Reset');
reset.onclick = function() { refresh(); }

function refresh() {
    // document.getElementById('playBtn').style.visibility = "visible";
    screen2.buttons.play = false;
    screen2.loop.stop();
    // document.getElementById('nxtBtn').style.visibility = "visible";
    screen2.buttons.step = false;
    // screen2.loop.stop();
    screen2.updateCircle(slider.value);
    screen2.step = 1;
    document.getElementById('nxtBtn').disabled = false;
    document.getElementById('playBtn').disabled = false;
    document.getElementById('gcd').innerHTML = '   ';
    document.getElementById('eqn').innerHTML = '   ';
    document.getElementById('order').innerHTML = '   ';
    document.getElementById('totient').innerHTML = '   ';
}

main();