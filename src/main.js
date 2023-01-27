import {Addmod} from './screens/addmod.js';

const container = document.getElementById('scene-container');
var screen1;

function main() {
    screen1 = new Addmod(container);
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

var nbtn = document.getElementById('nxtBtn');
nbtn.onclick = function() {
    screen1.tick();
}

var pbtn = document.getElementById('playBtn');
pbtn.onclick = function() {
    screen1.loop.start(screen1);
}

main();