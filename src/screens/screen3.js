import {Multiplicative} from '../maths/multiplicative.js';

const container = document.getElementById('scene-container');
var screen3;

class Screen3 extends Multiplicative {

    constructor(c) {
        super(c);
        this.setup();
    }

    updateCircle(sides) {
        super.updateCircle(sides);
        document.getElementById('stepCount').innerHTML = "";

    }

    updateLabels() {
        super.updateLabels();
        document.getElementById('iSlider').setAttribute("max", this.size-1);

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
    screen3.loop.start(screen3);
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