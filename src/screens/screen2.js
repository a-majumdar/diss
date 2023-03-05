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
        // this.node = 1;
    }

    updateCircle(sides) {
        super.updateCircle(sides);
        // document.getElementById('stepCount').innerHTML = "";

    }

    updateLabels() {
        super.updateLabels();
        // document.getElementById('iSlider').setAttribute("max", this.size-1);

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
    
    orders() {
        let geometry = new THREE.CircleGeometry(1.8, this.size, Math.PI/2);
        const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        let circle = new THREE.Mesh(geometry, material);
        this.shades = this.shading();
        // console.log(this.shades);
        for (let i=0; i < this.size; i++) {
            let index = 3 * (i + 1);
            this.ring[i] = this.makeNode(i, circle, geometry.attributes.position.array.slice(index, index+3));
        }
        this.loop.start(this);
    }

    tick() {
        if (this.counter < this.size && !this.tail.includes(this.counter)) {
            this.tail.unshift(this.counter);
            // let shade = this.shades[this.counter];
            // console.log(shade);
            // this.ring[this.counter].colour(`0x${shade+shade+shade}`);
            this.ring[this.counter].colour(common.orderColour(this.size, this.ring[this.counter].index));
            this.counter += 1;
            this.renderer.render(this.scene, this.camera);
        }
        else {
            this.loop.stop();
        }
    }

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
    screen2.jump();
}

var pbtn = document.getElementById('playBtn');
pbtn.onclick = function() {
    screen2.orders();
    // screen2.cycle();
}

var reset = document.getElementById('Reset');
reset.onclick = function() { refresh(); }

function refresh() {
    screen2.loop.stop();
    screen2.updateCircle(slider.value);
}

main();