import * as THREE from 'https://threejs.org/build/three.module.js';
import { FontLoader } from 'https://threejs.org/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://threejs.org/examples/jsm/geometries/TextGeometry.js';
import { Screen } from './screen';

let container = document.getElementById('scene-container');
var screen;

function main() {
    screen = new Screen(container);

    const loader = new FontLoader();

    loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

	    const geometry = new TextGeometry( 'Hello three.js!', {
		    font: font,
		    size: 80,
		    height: 5,
		    curveSegments: 12,
		    bevelEnabled: true,
		    bevelThickness: 10,
		    bevelSize: 8,
		    bevelOffset: 0,
		    bevelSegments: 5
	    } );
    } );
}