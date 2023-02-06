
import {Screen} from './screens/screen.js';
import * as THREE from 'https://threejs.org/build/three.module.js';


const container = document.getElementById('scene-container');
var screen;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function main() {
    screen = new Screen(container);

    let geometry = new THREE.CircleGeometry(3,12);
    let material = new THREE.MeshBasicMaterial({color:0xf0f0f0});
    let circle = new THREE.Mesh(geometry, material);
    circle.position.set(0,0,0);
    screen.scene.add(circle);
    screen.render(screen.scene, screen.camera);
    animate();

}


function onMouseMove(event) {

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
  
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
}

function render() {

    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, screen.camera);
  
    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects(screen.scene.children);
    if (intersects.length > 0) {
        for (var i = 0; i < intersects.length; i++) {
            intersects[i].object.material.color.set(0x4f3ea7);
        }
    }
    else {
        for (var i = 0; i < screen.scene.children; i++) {
            screen.scene.children[i].material.color.setHex('0xf0f0f0');
        }
    }
  
  
    screen.render(screen.scene, screen.camera);
  
  }


window.addEventListener('mousemove', onMouseMove, false);


function animate() {
    requestAnimationFrame(animate);
    render();
}

main();

