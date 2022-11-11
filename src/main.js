import * as THREE from 'https://unpkg.com/three@0.108.0/build/three.module.js';
import {Additive} from './additive.js';
// import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

let container = document.getElementById('scene-container');
var screen1;

function main() {
    screen1 = new Additive(container);
    screen1.setup();
}

main();

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
