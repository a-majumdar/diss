import * as THREE from 'https://unpkg.com/three@0.108.0/build/three.module.js';
// import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

const container = document.getElementById('scene-container');
const scene = new THREE.Scene();

const fov = 35;
const aspect = container.offsetWidth / container.offsetHeight;
const near = 0.1;
const far = 100;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far); //maybe use OrthographicCamera for 2d scenes or user interfaces?
camera.position.set(0,0,10);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

container.append(renderer.domElement);

function main() {

    // let geometry = new THREE.CircleGeometry( 2, 5 );
    // const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    // let circle = new THREE.Mesh( geometry, material );
    // scene.add( circle );
    let radius = 2;
    let segments = 5;
    let geometry = new THREE.CircleGeometry(radius, segments);
    let material = new THREE.PointsMaterial({
        color: 'red',
        size: 0.3,     // in world units
    });
    let points = new THREE.Points(geometry, material);
    scene.add(points);
    renderer.render(scene, camera);

}

main();

var slider = document.getElementById('nSlider');
slider.oninput = function() {
    let sides = slider.value;
    updatePoints(sides);
}

function updateCircle(sides) {

    scene.remove.apply(scene, scene.children);
    // console.log("scene cleared");
    let geometry = new THREE.CircleGeometry(2, sides);
    const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    let circle = new THREE.Mesh(geometry, material);
    scene.add(circle);
    // console.log("new polygon added");
    renderer.render(scene, camera);
}

function updatePoints(nodes) {
    scene.remove.apply(scene, scene.children);
    let geometry = new THREE.CircleGeometry(2, nodes);
    let material = new THREE.PointsMaterial({
        color: 'red',
        size: 0.3,     // in world units
    });
    let points = new THREE.Points(geometry, material);
    scene.add(points);
    renderer.render(scene, camera);
}