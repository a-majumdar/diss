import {Multiplicative} from '../maths/multiplicative.js';
import {Node} from "../components/node.js";
import * as THREE from 'https://threejs.org/build/three.module.js';
import {Common} from "../maths/common.js";




const container = document.getElementById('scene-container');
var screen3;
const common = new Common();

class Screen3 extends Multiplicative {

    ring;

    constructor(c) {
        super(c);
        this.ring = [];
        this.setup();
    }

    updateCircle(sides) {
        super.updateCircle(sides);
        this.orders();
        document.getElementById('stepCount').innerHTML = "";
        document.getElementById('gcd').innerHTML = '   ';
        this.counter = 0;
    }

    updateLabels() {
        super.updateLabels();
        document.getElementById('iSlider').setAttribute("max", this.size-1);
        document.getElementById('i').innerHTML = `${this.step}`;
    }

    orders() {
        let geometry = new THREE.CircleGeometry(1.8, this.size, Math.PI/2);
        const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        let circle = new THREE.Mesh(geometry, material);
        // this.shades = this.shading();
        // console.log(this.shades);
        for (let i=0; i < this.size; i++) {
            let index = 3 * (i + 1);
            let node = new Node(geometry.attributes.position.array.slice(index, index+3), i, this.size);
            // console.log(common.orderColour(this.size, node.index));
            node.colour(common.orderColour(this.size, node.index));
            this.ring.unshift(node);
            node.parent = circle;
            this.scene.add(node.object);
                // this.ring[i] = this.makeRingNode(i, circle, geometry.attributes.position.array.slice(index, index+3));
        }
        let first = this.ring.pop();
        this.ring.unshift(first);
        for (let i = 0; i < this.size; i++) {
            this.ring[i].changeIndex(i);
        }
        
        // for (let i = 0; i < this.size; i++) {
        //     this.ring[i].color[this.common.orderColour(this.size, this.ring[i].index)];
        // }
        this.renderer.render(this.scene, this.camera);
    }

    makeRingNode(i, parent, vector) {
        let node = new Node(vector, i, this.size);
        this.ring.unshift(node);
        node.parent = parent;
        this.scene.add(node.object);
        // console.log(`node ${index} added`);
        return node;
    }

    finished() {
        console.log("finished");
        document.getElementById('gcd').innerHTML = `The greatest common divisor of ${this.size} and ${this.step} is ${common.gcd(this.size, this.step)}`;
        document.getElementById('gcd').innerHTML += common.gcd(this.size,this.step) == 1 ? " (COPRIME)" : "";
        document.getElementById('order').innerHTML = `Order(${this.size},${this.step}) = ${common.mOrder(this.size, this.step)}`;
        // document.getElementById('eqn').innerHTML = `order x gcd = n = ${this.size}`;
    }

    tick() {
        super.tick();
        console.log(this.tail, this.counter);
        if (this.counter == 0) {
            document.getElementById('sums').innerHTML = `${this.step} ^ ${this.counter-1} = 1 * ${(this.step)} = ${this.node} (mod ${this.size})`;
        }
        else { 
            document.getElementById('sums').innerHTML = `${this.step} ^ ${this.counter-1} = ${this.tail[0]} * ${(this.step)} = ${this.node} (mod ${this.size})`;
        }
        this.counter++;
    }

}

function main() {
    screen3 = new Screen3(container);
}

var slider = document.getElementById('nSlider');
slider.oninput = function() {
    let sides = slider.value;
    screen3.updateCircle(sides);
    screen3.stepSize(1);
    document.getElementById('iSlider').setAttribute('value', 1);
}

var steps = document.getElementById('iSlider');
steps.oninput = function() { refresh(); }

var nbtn = document.getElementById('nxtBtn');
nbtn.onclick = function() {
    screen3.tick();
}

var pbtn = document.getElementById('playBtn');
pbtn.onclick = function() {
    screen3.loop.start(screen3, 300);
}

// var speed = document.getElementById('speedSlider');
// speed.oninput = function() {
//     screen3.playSpeed(speed.value);
//     // if (screen3.loop.interval) { screen3.loop.changeSpeed(screen3); }
// }

var reset = document.getElementById('Reset');
reset.onclick = function() { refresh(); }

function refresh() {
    screen3.loop.stop();
    screen3.updateCircle(slider.value);
    screen3.stepSize(steps.value);
}

main();