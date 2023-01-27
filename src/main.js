import * as THREE from 'https://unpkg.com/three@0.108.0/build/three.module.js';
import * as FontLoader from 'https://threejs.org/examples/jsm/loaders/FontLoader.js';
import {Additive} from './additive.js';
// import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

let container = document.getElementById('scene-container');
var screen1;

function main() {
    screen1 = new Additive(container);
    screen1.setup();
}

var slider = document.getElementById('nSlider');
slider.oninput = function() {
    let sides = slider.value;
    screen1.updateCircle(sides);
    screen1.stepSize(1);
    document.getElementById('iSlider').setAttribute('value', 1);
}

var steps = document.getElementById('iSlider');
steps.oninput = function() {
    screen1.stepSize(steps.value);
    screen1.updateCircle(slider.value);
}

var btn = document.getElementById('nxtBtn');
btn.onclick = function() {
    screen1.animate();
}

// container.addEventListener("mousemove", (event) => {
//     console.log(container.children);
//     screen1.pointer.x = event.clientX / container.offsetWidth;
//     screen1.pointer.y = event.clientY / container.offsetHeight;
//     // screen1.pointer.x = (event.clientX / container.offsetWidth) * 2 - 1;
//     // screen1.pointer.y = -(event.clientY / container.offsetHeight) * 2 + 1;
//     console.log(screen1.pointer);
//     // let intersected = screen1.intersect(screen1.pointer);
//     // if (intersected.length > 0) {

//     // }
// });

main();
