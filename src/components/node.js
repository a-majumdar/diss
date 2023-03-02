import * as THREE from 'https://threejs.org/build/three.module.js';

class Node {

    object;
    index;
    n;

    constructor(vector, value, size) {

        this.index = value;
        this.n = size;

        let geometry = new THREE.CircleGeometry(0.05,12);
        let material = new THREE.MeshBasicMaterial({color:'white'});
        this.object = new THREE.Mesh(geometry, material);
        this.object.position.set(vector[0], vector[1], vector[2]);

    }

    colour(hue) {
        this.object.material.color.setHex(hue);
    }

}

export {Node};