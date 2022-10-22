import * as THREE from 'three';
// import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

const container = document.querySelector('#scene-container');

const scene = new THREE.Scene();
// scene.background = new THREE.Color('skyblue');

const fov = 35;
const aspect = container.clientWidth / container.clientHeight;
const near = 0.1;
const far = 100;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far); //maybe use OrthographicCamera for 2d scenes or user interfaces?
camera.position.set(0,3,10);

// const geometry = new THREE.BoxGeometry(2, 2, 2);
// const material = new THREE.MeshBasicMaterial();
// const cube = new THREE.Mesh(geometry, material);
//
// scene.add(cube);

const sides = document.getElementById('nSlider').value;
const geometry = new THREE.CircleGeometry( 5, sides );
const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
const circle = new THREE.Mesh( geometry, material );
scene.add( circle );

const renderer = new THREE.WebGLRenderer();
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

container.append(renderer.domElement);

renderer.render(scene, camera);
