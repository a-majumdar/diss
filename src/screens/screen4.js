import { Multiplicative } from "../maths/multiplicative.js";
import {Common} from "../maths/common.js";
import * as THREE from 'https://threejs.org/build/three.module.js';
import {Node} from "../components/node.js";

const container = document.getElementById('scene-container');
var screen4;
const common = new Common();

class Screen4 extends Multiplicative {

    multiplicatives;
    ring;
    buttons = {
        step: false,
        play: false,
        pause: false
    };
    interval;


    constructor(c) {
        super(c);
        this.setup();
        this.ring = [];
        this.step = 1;
    }

    updateCircle(sides) {
        // reset everything
        this.loop.stop();
        // this.scene.remove.apply(this.scene, this.scene.children);
        // this.nodes = [];
        this.ring = [];
        // this.tail = [];
        this.multiplicatives = [];
        // this.size = sides;
        this.counter = 0;
        this.step = 1;

        // update labels

        // update circle
        super.updateCircle(sides);
        for (let i = 0; i < this.nodes.length; i++) {
            if (common.gcd(i, this.size) == 1) {
                this.multiplicatives.push(i);
            }
            else {
                this.scene.remove(this.nodes.splice(i, 1)[0].object);
            }
        }
        console.log(this.multiplicatives, this.nodes);

        this.renderer.render(this.scene, this.camera);

    }

    tick() {
        console.log("tick", this.counter, this.step);
        if (this.buttons.step) { this.steps(); }
        else if (this.buttons.play) { this.otick(); }
    }

    steps() {
        this.tail = [];
        this.counter = 0;
        for (let i = 0; i < this.multiplicatives.length; i++) { this.nodes[i].colour(0xffffff); }
        // this.renderer.render(this.scene, this.camera);
        this.interval = setInterval(() => { this.rr() }, 100);
    }

    rr() {
        let index = (this.step ** (this.counter + 1)) % this.size;
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].index == index) {
                index = i;
                break;
            }
        }
        let node = this.nodes[index];

        if (this.counter < this.multiplicatives.length && !this.tail.includes(node)) {
            this.tail.unshift(node);
            this.comet();
            this.renderer.render(this.scene, this.camera);
            this.counter++;
        }
        else {
            clearInterval(this.interval);
            this.onode();
            this.step = this.multiplicatives[this.multiplicatives.indexOf(this.step) + 1];
        }

    }

    comet() {

        for (let i = this.tail.length-1; i >= 0; i--) {
            let hue = i*25 > 175 ? 'af' : this.charPairs[i*25];
            let index = this.multiplicatives.indexOf(this.tail[i].index);   
            this.nodes[index].colour(`0xff${hue+hue}`);
            console.log(hue, index);
        }
    }

    onode() {
        let index = 3 * (this.size - this.step + 1);
        let [circle, geometry] = this.innerCircle();
        this.ring[this.step] = this.makeRingNode(this.step, circle, geometry.attributes.position.array.slice(index, index+3));

        this.ring[this.step].colour(common.findEquivOrder(this.size, this.ring[this.step].index));
        this.renderer.render(this.scene, this.camera);

        // update labels
        document.getElementById('gcd').innerHTML = `gcd(${this.size},${this.step}) = ${common.gcd(this.step, this.size)}`;
        document.getElementById('totient').innerHTML = `phi(n) = ${common.totient(this.size)}`;
        document.getElementById('order').innerHTML = `order(${this.size},${this.step}) = ${common.mOrder(this.size, this.step)}`;

    }

    otick() {
        if (this.counter < this.multiplicatives.length) {
            let node = this.multiplicatives[this.counter];
            this.tail.unshift(this.nodes[this.counter]);
            this.ring[node].colour(common.findEquivOrder(this.size, this.ring[node].index));
            document.getElementById('gcd').innerHTML = `gcd(${this.size},${node}) = ${common.gcd(node, this.size)}`;
            document.getElementById('order').innerHTML = `order(${this.size},${node}) = ${common.mOrder(this.size, node)}`;
            this.counter += 1;
        }
        else {
            this.loop.stop();
            this.buttons.play = false;
            document.getElementById('totient').innerHTML = `phi(n) = ${common.totient(this.size)}`;
        }
    }

    orders() {
        let [circle, geometry] = this.innerCircle();
        for (let i = 0; i < this.multiplicatives.length; i++) {
            let temp = this.multiplicatives[i];
            let index = 3 * (this.size - temp + 1); // 3 * temp
            this.ring[temp] = this.makeRingNode(temp, circle, geometry.attributes.position.array.slice(index, index+3));
        }
        let first = this.ring.pop();
        this.ring.unshift(first);
        for (let i = 0; i < this.multiplicatives.length; i++) {
            this.ring[i].changeIndex(this.multiplicatives[i]);
        }
        this.renderer.render(this.scene, this.camera);
        this.loop.start(this, 300);
    }

    innerCircle() {
        let geometry = new THREE.CircleGeometry(1.8, this.size, Math.PI/2);
        const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        let circle = new THREE.Mesh(geometry, material);
        return [circle, geometry];
    }


    makeRingNode(i, parent, vector) {
        let node = new Node(vector, i, this.size);
        // this.ring.unshift(node);
        node.parent = parent;
        this.scene.add(node.object);
        return node;
    }

}

var slider = document.getElementById('nSlider');
slider.oninput = function() {
    let sides = slider.value;
    screen4.updateCircle(sides);
    screen4.step = 1;
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

function main() {
    screen4 = new Screen4(container);
}

main();