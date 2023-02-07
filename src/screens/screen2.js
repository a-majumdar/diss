import {Multiplicative} from '../maths/multiplicative.js';

const container = document.getElementById('scene-container');
var screen2;

function main() {
    screen2 = new Multiplicative(container);
    screen2.setup();
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
    screen2.loop.start(screen2);
}

var reset = document.getElementById('Reset');
reset.onclick = function() { refresh(); }

function refresh() {
    screen2.loop.stop();
    screen2.updateCircle(slider.value);
}

main();