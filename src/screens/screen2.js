import { Loop } from "../systems/loop.js";
import { Addmod } from "../maths/addmod.js";

const container = document.getElementById('scene-container');
var screen2;

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
        for (let i=0; i < this.size; i++) {
            this.tick();
            await this.loopWait();
        }
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