import {Addmod} from '../maths/addmod.js';
import * as THREE from 'https://threejs.org/build/three.module.js';
import {Common} from '../maths/common.js';


const container = document.getElementById('scene-container');
var screen1;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var intersects = null;
let INTERSECTED = null;
const common = new Common();


class Screen1 extends Addmod {

    constructor(c) {
        super(c);
        this.setup();
        this.nodes[this.step].colour('0x0000ff');
        this.renderer.render(this.scene, this.camera);
    }

    updateCircle(sides) {
        super.updateCircle(sides);
        document.getElementById('stepCount').innerHTML = "   ";
        document.getElementById('i').innerHTML = `${this.step}`;
        document.getElementById('gcd').innerHTML = '   ';
        document.getElementById('eqn').innerHTML = '   ';
    }

    updateLabels() {
        super.updateLabels();
        document.getElementById('iSlider').setAttribute("max", this.size-1);
        document.getElementById('i').innerHTML = `${this.step}`;
        // document.getElementById('i').innerHTML = this.step;

    }

    finished() {
        document.getElementById('gcd').innerHTML = common.gcd(this.size, this.step) == 1 ? `${this.size} and ${this.step} are coprime` : `The greatest common divisor of ${this.size} and ${this.step} is ${common.gcd(this.size, this.step)}`;
        document.getElementById('eqn').innerHTML = `Order(${this.size},${this.step}) = n / gcd(${this.size},${this.step}) 
            = ${this.size} / ${common.gcd(this.size, this.step)} 
            = ${this.size / (common.gcd(this.size, this.step))}`;
    }
}


var slider = document.getElementById('nSlider');
slider.oninput = function() {
    let sides = slider.value;
    screen1.updateCircle(sides);
    screen1.stepSize(1);
    document.getElementById('iSlider').setAttribute('value', 1);
}

var steps = document.getElementById('iSlider');
steps.oninput = function() { refresh(); }

var nbtn = document.getElementById('nxtBtn');
nbtn.onclick = function() {
    screen1.loop.flag = false;
    screen1.tick();
}

var pbtn = document.getElementById('playBtn');
pbtn.onclick = function() {
    screen1.loop.start(screen1, 300);
}

// var speed = document.getElementById('speedSlider');
// speed.oninput = function() {
//     screen1.playSpeed(speed.value);
//     // if (screen1.loop.interval) { screen1.loop.changeSpeed(screen1); }
// }

var reset = document.getElementById('Reset');
reset.onclick = function() { refresh(); }

function refresh() {
    screen1.loop.stop();
    screen1.updateCircle(slider.value);
    screen1.stepSize(steps.value);
}

function onClick(event) {
    console.log('click');
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function updateRender() {

    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, screen1.camera);
  
    // calculate objects intersecting the picking ray
    intersects = raycaster.intersectObjects(screen1.scene.children, false);
    if ( intersects.length > 0 ) {
        console.log('intersecting');
		if ( INTERSECTED != intersects[ 0 ].object ) {
			if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
			
			INTERSECTED = intersects[ 0 ].object;
			INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
			INTERSECTED.material.color.setHex( 0xff0000 );
		}
	} else {
		if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
		INTERSECTED = null;
	}
    screen1.renderer.render(screen1.scene, screen1.camera);
}

container.addEventListener('click', onClick);

function animate() {
    requestAnimationFrame(animate);
    updateRender();
}

function main() {
    screen1 = new Screen1(container);
}
  
main();
animate();
  