import * as THREE from 'three';
// import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

function main() {
    const container = document.getElementById('scene-container');

    const scene = new THREE.Scene();
    // scene.background = new THREE.Color('skyblue');

    const fov = 35;
    const aspect = container.offsetWidth / container.offsetHeight;
    const near = 0.1;
    const far = 100;

    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far); //maybe use OrthographicCamera for 2d scenes or user interfaces?
    camera.position.set(0,0,10);

    // const geometry = new THREE.BoxGeometry(2, 2, 2);
    // const material = new THREE.MeshBasicMaterial();
    // const cube = new THREE.Mesh(geometry, material);
    //
    // scene.add(cube);

    let geometry = new THREE.CircleGeometry( 2, sides );
    const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    let circle = new THREE.Mesh( geometry, material );
    scene.add( circle );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    container.append(renderer.domElement);

    renderer.render(scene, camera);
}

function updateCircle(n) {
    scene.remove(screen.children[0]);
    let geometry = new THREE.CircleGeometry(2, n);
    let circle = new THREE.Mesh(geometry, material);
    scene.add(circle);
    renderer.render(scene, camera);
}

const sides = document.getElementById('nSlider').value;
main();