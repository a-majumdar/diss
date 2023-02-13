import { Loop } from "../systems/loop.js";
import { Addmod } from "../maths/addmod.js";
import {Common} from "../maths/common.js";
import * as THREE from 'https://threejs.org/build/three.module.js';


const container = document.getElementById('scene-container');
var screen2;
const common = new Common();
// indicators;

class Screen2 extends Addmod {

    constructor(c) {
        super(c);
        this.setup();
    }

    updateCircle(sides) {
        super.updateCircle(sides);
        // document.getElementById('stepCount').innerHTML = "";

    }

    updateLabels() {
        super.updateLabels();
        // document.getElementById('iSlider').setAttribute("max", this.size-1);

    }

    async cycle() {

        // this.nodes = [];
        let geometry = new THREE.CircleGeometry(1.8, this.size, Math.PI/2);
        const material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
        let circle = new THREE.Mesh(geometry, material);
        let shades = this.shading();

        for (let i=0; i < this.size; i++) {
            this.tick();
            await this.loopWait();
            let n = this.makeNode(circle, geometry.attributes.position.array.slice(3*i, 3*i+3));
            let shade = shades[i];
            n.material.color.setHex(`0x${shade+shade+shade}`);
            this.renderer.render(this.scene, this.camera);
        }
    }

    shading() {

        let factors = common.factors(this.size);
        let shadediff = Math.floor(this.charPairs.length / (factors.length + 1));
        let factorindicies = function() {
            for (const [index, value] of factors.entries()) {
                factorindicies[value] = charPairs[shadediff * index];
            }
        }
        let orders = this.findOrder(this.size);
        let shades = orders.map(elem => {
            return factorindicies[orders[elem]];
        });
        return shades;

    }

    findOrder(n) {
        const result = [];
        for (let i = 1; i <= n; i++) {
            let order = 1;
            let x = i;
            while (x !== 0) {
                order++;
                x = (x + i) % n;
            }
            result[i] = order;
        }
        return result;
    }


    async loopWait() {
        return new Promise(resolve => {
            const intervalId = setInterval(() => {
                if (this.loop.flag) {
                  clearInterval(intervalId);
                  resolve();
                }
              }, 100);
        });
    }

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
    screen2.tick();
}

var pbtn = document.getElementById('playBtn');
pbtn.onclick = function() {
    screen2.cycle();
}

var reset = document.getElementById('Reset');
reset.onclick = function() { refresh(); }

function refresh() {
    screen2.loop.stop();
    screen2.updateCircle(slider.value);
}

main();