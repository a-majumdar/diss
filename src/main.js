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
    updateCircle(12);
}

// main();

var slider = document.getElementById('nSlider');
slider.oninput = function() {
    let sides = slider.value;
    updateCircle(sides);
}

function updateCircle(sides) {

    scene.remove.apply(scene, scene.children);
    let geometry = new THREE.CircleGeometry(2, sides, Math.PI/2);
    const material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
    let circle = new THREE.Mesh(geometry, material);
    for (let i=1;i<=sides;i++) {
        makeNode(circle, geometry.vertices[i], i);
    }
    renderer.render(scene, camera);
    console.log(geometry.vertices);
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
    console.log(geometry.vertices);
}

function makeNode(parent, vector, index) {
    let geometry = new THREE.CircleGeometry(0.1,12);
    let material = new THREE.MeshBasicMaterial({color:0xf0f0f0});
    let node = new THREE.Mesh(geometry, material);
    node.position.set(vector.x, vector.y, vector.z);
    node.parent = parent;
    scene.add(node);
    console.log(`node ${index} added`);
}

    // create a point at each vertex of points
    // add each point as child of points with point.parent = points;
    //      OR add list of point[s] as children of points with points.attach(list);
    // for each frame, re-render with nodes changing colours/shades
    // wait for user input before moving to next 'frame' 