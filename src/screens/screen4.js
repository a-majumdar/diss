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
    primitiveRoots = [3,4,5,6,7,9,10,11,13,14,17,18,19,22,23,25,26,27,29,31,34,37,38,41,43,46,47,49,50,53,54,58,59,61,62,67,71,73,74,79,81,82,83,86,89,94,97,98];


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
        document.getElementById("gcd").innerHTML = "";
        document.getElementById("order").innerHTML = "";
        document.getElementById("totient").innerHTML = "";
        document.getElementById("eqn").innerHTML = "";


        // update circle
        super.updateCircle(sides);
        for (let i = 0; i < this.size; i++) {
            if (common.gcd(i, this.size) == 1) {
                this.multiplicatives.push(i);
            }
            else {
                let temp;
                for (let j = 0; j < this.nodes.length; j++) {
                    if (this.nodes[j].index == i) {
                        temp = this.nodes.splice(j, 1)[0];
                        this.scene.remove(temp.object);
                        break;
                    }
                }
                // this.scene.remove(this.nodes.splice(i, 1)[0].object);
            }
        }
        // console.log(this.multiplicatives, this.nodes);

        this.renderer.render(this.scene, this.camera);

    }

    tick() {
        // console.log("tick", this.counter, this.step);
        if (this.buttons.step) { this.steps(); }
        else if (this.buttons.play) { this.otick(); }
    }

    steps() {
        // console.log("in steps()");

        this.tail = [];
        this.counter = 0;
        for (let i = 0; i < this.multiplicatives.length; i++) { this.nodes[i].colour(0xffffff); }
        // this.renderer.render(this.scene, this.camera);
        this.interval = setInterval(() => { this.rr() }, 100);
    }

    rr() {
        // console.log("in rr()");

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
        // console.log("in comet()");


        for (let i = this.tail.length-1; i >= 0; i--) {
            let hue = i*25 > 175 ? 'af' : this.charPairs[i*25];
            let index = this.multiplicatives.indexOf(this.tail[i].index);   
            this.nodes[index].colour(`0xff${hue+hue}`);
            // console.log(hue, index);
        }
    }

    onode() {
        // console.log("in onode()");

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
        // console.log("in otick()");

        if (this.counter < this.multiplicatives.length) {
            // console.log("in if{}");
            let node = this.multiplicatives[this.counter];
            this.tail.unshift(this.nodes[this.counter]);
            let temp = common.findEquivOrder(this.size, this.ring[this.counter].index);
            // console.log(temp);
            this.ring[this.counter].colour(temp);
            this.renderer.render(this.scene, this.camera);
            document.getElementById('gcd').innerHTML = `gcd(${this.size},${node}) = ${common.gcd(node, this.size)}`;
            document.getElementById('order').innerHTML = `order(${this.size},${node}) = ${common.mOrder(this.size, node)}`;
            this.counter++;
        }
        else {
            this.loop.stop();
            this.buttons.play = false;
            document.getElementById('totient').innerHTML = `phi(n) = ${common.totient(this.size)}`;
            if (this.primitiveRoots.includes(this.size)) {
                console.log("has primitive roots");
                document.getElementById('eqn').innerHTML = `n has primitive roots`;
            }
        }
    }

    orders() {
        // console.log("in orders()");
        let [circle, geometry] = this.innerCircle();
        for (let i = 0; i < this.multiplicatives.length; i++) {
            let temp = this.multiplicatives[i];
            let index = 3 * (this.size - temp + 1); // 3 * temp
            this.ring.push(this.makeRingNode(temp, circle, geometry.attributes.position.array.slice(index, index+3)));
        }
        // let first = this.ring.pop();
        // this.ring.unshift(first);
        // first = this.ring.pop();
        // this.ring.unshift(first);
        // console.log(this.ring);
        for (let i = 0; i < this.multiplicatives.length; i++) {
            this.ring[i].changeIndex(this.multiplicatives[i]);
            // this.ring[i].colour(0xff0000);
        }
        this.renderer.render(this.scene, this.camera);
        this.loop.start(this, 300);
    }

    innerCircle() {
        let geometry = new THREE.CircleGeometry(1.8, this.size, Math.PI/2);
        let material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        let circle = new THREE.Mesh(geometry, material);
        return [circle, geometry];
    }


    makeRingNode(i, parent, vector) {
        // console.log("making ring node " + i);
        let node = new Node(vector, i, this.size);
        // this.ring.unshift(node);
        node.parent = parent;
        this.scene.add(node.object);
        return node;
    }

}

var slider = document.getElementById('nSlider');
slider.oninput = function() {
    // console.log("new value: " + slider.value);
    let sides = slider.value;
    screen4.updateCircle(sides);
    screen4.step = 1;
}

var nbtn = document.getElementById('nxtBtn');
nbtn.onclick = function() {
    // document.getElementById('playBtn').style.visibility = "hidden";
    screen4.buttons.step = true;
    // console.log("press next");
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
    // console.log("press play");
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
    // console.log("refresh");
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