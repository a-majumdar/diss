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
        document.getElementById('sums').innerHTML = "";
        document.getElementById('order').innerHTML = "";
        document.getElementById('eqn').innerHTML = "";
        document.getElementById('phi').innerHTML = `phi(${sides}) = ${common.totient(sides)}`;
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
        let obj = new Node(vector, i, this.size);
        this.ring.unshift(obj);
        obj.parent = parent;
        this.scene.add(obj.object);
        // console.log(`obj ${index} added`);
        return obj;
    }

    finished() {
        // console.log("finished");
        // document.getElementById('gcd').innerHTML = `The greatest common divisor of ${this.size} and ${this.step} is ${common.gcd(this.size, this.step)}`;
        // document.getElementById('gcd').innerHTML += common.gcd(this.size,this.step) == 1 ? " (COPRIME)" : "";
        // document.getElementById('eqn').innerHTML = `order x gcd = n = ${this.size}`;
        // report on RSA-friendliness
    }

    tick() {
        if (this.counter == this.size - 1) {
            document.getElementById('nxtBtn').disabled = true;
            document.getElementById('playBtn').disabled = true;
        }

        super.tick();
        console.log(this.tail, this.counter);
        if (this.counter == 1) {
            document.getElementById('sums').innerHTML = `${this.step} ^ ${this.counter} = ${(this.step)} = ${this.node} (mod ${this.size})`;
        }
        else { 
            document.getElementById('sums').innerHTML = `${this.step} ^ ${this.counter} = ${this.tail[1]} * ${(this.step)} = ${this.node} (mod ${this.size})`;
        }

        if (this.tail[0] == 1) { 
            document.getElementById('order').innerHTML = `Order(${this.step},${this.size}) = ${common.mOrder(this.size, this.step)}`; 
            this.nodes[1].colour('0x00ff0f');
            let phi = common.totient(this.size);
            if (common.mOrder(this.size, this.step) == phi) {
                document.getElementById('order').innerHTML += ` = phi(${this.size}) so ${this.step} is a PRIMITIVE ROOT for ${this.size}`;
            }
            // if (this.counter == phi) {
            //     document.getElementById('gcd').innerHTML = ``;
            // }
            // document.getElementById('totient').innerHTML = `Order(${this.step},${this.size})  (PRIMITIVE ROOT)`;
        }
        // document.getElementById('sums').innerHTML = `${this.step} ^ ${this.counter} = something = ${this.node} (mod ${this.size})`;
        this.counter++;
    }

}

function main() {
    screen3 = new Screen3(container);
}

var slider = document.getElementById('nSlider');
slider.oninput = function() {
    screen3.loop.stop();
    let sides = slider.value;
    screen3.updateCircle(sides);
    screen3.stepSize(1);
    document.getElementById('iSlider').value = 1;
    document.getElementById('nxtBtn').disabled = false;
    document.getElementById('playBtn').disabled = false;
}

var steps = document.getElementById('iSlider');
steps.oninput = function() { refresh(); }

var nbtn = document.getElementById('nxtBtn');
nbtn.onclick = function() {
    screen3.tick();
}

var pbtn = document.getElementById('playBtn');
pbtn.onclick = function() {
    document.getElementById('nxtBtn').disabled = true;
    document.getElementById('playBtn').disabled = true;
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
    document.getElementById('nxtBtn').disabled = false;
    document.getElementById('playBtn').disabled = false;
}

main();