import {Addmod} from '../maths/addmod.js';
import * as THREE from 'https://threejs.org/build/three.module.js';


const container = document.getElementById('scene-container');
var screen1;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var intersects = null;
let INTERSECTED = null;


class Screen1 extends Addmod {

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
    screen1.tick();
}

var pbtn = document.getElementById('playBtn');
pbtn.onclick = function() {
    screen1.loop.start(screen1);
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
  