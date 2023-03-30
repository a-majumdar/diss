import { Loop } from "../systems/loop.js";
import { Addmod } from "../maths/addmod.js";
import {Common} from "../maths/common.js";
import * as THREE from 'https://threejs.org/build/three.module.js';
import {Node} from "../components/node.js";


const container = document.getElementById('scene-container');
var screen2;
const common = new Common();
// indicators;

class Screen2 extends Addmod {

    flag;
    shades;
    ring;
    jump;
    buttons = {
        step: false,
        play: false,
        pause: false
    }
    stop;

    constructor(c) {
        super(c);
        this.setup();
        // this.flag = true;
        this.ring = [];
        this.step = 1;
        stop = true;
        // this.jump = 1;
        // console.log(common.totient(13));
        // console.log(common.totient(15));
        // console.log(common.totient(20));

        // this.node = 1;
    }

    tick() {
        let [circle, geometry] = this.innerCircle();
        if (this.buttons.step) { this.steps(circle, geometry); }
        else if (this.buttons.play) { this.otick(); }
    }

    steps(circle, geometry) {
        this.stop = false;
        for (this.counter = 0; this.counter < this.size; this.counter++) {
                for (let i = 0; i < 7000000; i++) {} // this.sleep(200); //setTimeout(this.interval(), 200);
                this.interval();
                if (this.stop) { break; }
        }
        console.log('finished outer ring');
        if (this.loop.flag) {
            console.log('loading inner node');
            let index = 3 * (this.step + 1);
            this.ring[this.step] = this.makeRingNode(this.step, circle, geometry.attributes.position.array.slice(index, index+3));
            this.ring[this.step].changeIndex(this.size - this.step);
            this.ring[this.step].colour(common.orderColour(this.size, this.ring[this.step].index));
            this.renderer.render(this.scene, this.camera);
            // if (this.node == 1) { this.mInverse(); }
            // this.updateLabels();
            // this.sumLabel();
        }

        this.step++;

    }

    interval() {
        let node = (this.step*(this.counter + 1)) % this.size;
        if (this.counter < this.size && !this.tail.includes(node)) {
            this.tail.unshift(node);
            this.changeColours();
            //this.counter += 1;
            this.renderer.render(this.scene, this.camera);
        }
        else {
            this.loop.stop();
            this.stop = true;
            // this.finished();
        }
    }

    sleep(ms) {
        var currentTime = new Date().getTime();
        while (currentTime + ms >= new Date().getTime()) {
        }
    }

    otick() {
        if (this.counter < this.size) { // && !this.tail.includes(this.counter)
            this.tail.unshift(this.counter);
            // let shade = this.shades[this.counter];
            // console.log(shade);
            // this.ring[this.counter].colour(`0x${shade+shade+shade}`);
            this.ring[this.counter].colour(common.orderColour(this.size, this.ring[this.counter].index));
            this.counter += 1;
            this.renderer.render(this.scene, this.camera);
            document.getElementById('gcd').innerHTML = `gcd(${this.size},${this.counter}) = ${common.gcd(this.counter, this.size)}`;
            document.getElementById('totient').innerHTML = `phi(n) = ${common.totient(this.size)}`;
            document.getElementById('order').innerHTML = `order(${this.size},${this.counter}) = ${common.order(this.counter, this.size)}`;
        }
        else {
            this.loop.stop();
        }
    }

    orders() {
        
        // this.shades = this.shading();
        // console.log(this.shades);
        let [circle, geometry] = this.innerCircle();
        console.log(geometry);
        for (let i=0; i < this.size; i++) {
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
        let node = new Node(vector, i, this.size);
        this.ring.unshift(node);
        node.parent = parent;
        this.scene.add(node.object);
        // console.log(`node ${index} added`);
        return node;
    }

    // updateCircle(sides) {
        
    //     super.updateCircle(sides);
    //     // document.getElementById('stepCount').innerHTML = "";
        
    // }

    // updateLabels() {
    //     super.updateLabels();
    //     // document.getElementById('iSlider').setAttribute("max", this.size-1);

    // }

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
            // while (!this.flag) {
            //     if (this.loop.flag) { this.flag = true; }
            // }
            let index = 3 * (i + 1);
            let n = this.makeNode(circle, geometry.attributes.position.array.slice(index, index+3));
            let shade = shades[i];
            n.colour(`0x${shade+shade+shade}`);
            this.renderer.render(this.scene, this.camera);
            this.flag = false;
        }
    }
    


    // tick() {
    //     if (this.counter < this.size && !this.tail.includes(this.counter)) {
    //         this.tail.unshift(this.counter);
    //         // let shade = this.shades[this.counter];
    //         // console.log(shade);
    //         // this.ring[this.counter].colour(`0x${shade+shade+shade}`);
    //         this.ring[this.counter].colour(common.orderColour(this.size, this.ring[this.counter].index));
    //         this.counter += 1;
    //         this.renderer.render(this.scene, this.camera);
    //     }
    //     else {
    //         this.loop.stop();
    //     }
    // }

    shading() {

        let factors = common.factors(this.size);
        let shadediff = 255/this.size; //Math.floor(255 / this.size);
        console.log(shadediff);
        let orders = this.findOrder(this.size);
        console.log(orders);
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

    findOrder(n) {
        let result = [];
        for (let i = 0; i < n; i++) {
            // let order = 1;
            // let x = i;
            // while (x !== 0) {
            //     order++;
            //     x = (x + i) % n;
            // }
            result[i] = n / common.gcd(n, i);
        }
        // result.shift();
        return result;
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

    // async loopWait() {
    //     return new Promise(resolve => {
    //         const intervalId = setInterval(() => {
    //             if (this.loop.flag) {
    //               clearInterval(intervalId);
    //               resolve();
    //             }
    //           }, 100);
    //     });
    // }

}

function main() {
    screen2 = new Screen2(container);
}

var slider = document.getElementById('nSlider');
slider.oninput = function() {
    let sides = slider.value;
    screen2.updateCircle(sides);
    screen2.stepSize(1);
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
    screen2.tick();
}

var pbtn = document.getElementById('playBtn');
pbtn.onclick = function() {
    // document.getElementById('nxtBtn').style.visibility = "hidden";
    screen2.buttons.play = true;
    if (screen2.buttons.step) {
        screen2.buttons.step = false;
        screen2.counter = screen2.step;
    }
    screen2.orders();
    // screen2.cycle();
}

var reset = document.getElementById('Reset');
reset.onclick = function() { refresh(); }

function refresh() {
    document.getElementById('playBtn').style.visibility = "visible";
    screen2.buttons.play = false;
    screen2.loop.stop();
    document.getElementById('nxtBtn').style.visibility = "visible";
    screen2.buttons.step = false;
    // screen2.loop.stop();
    screen2.updateCircle(slider.value);
    screen2.step = 1;
}

main();