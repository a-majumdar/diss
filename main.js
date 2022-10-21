import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

function main() {
    const canvas = document.createElement('canvas');
    const renderer = new THREE.WebGLRenderer({canvas, alpha: true});
    renderer.setScissorTest(true);

    function addScene(elem, fn) {
        const ctx = document.createElement('canvas').getContext('2d');
        elem.appendChild(ctx.canvas);
    }

    function makeScene(elem) {
        const scene = new THREE.Scene();

        const fov = 45;
        const aspect = 2;
        const near = 0.1;
        const far = 5;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(0,1,2);
        camera.lookAt(0,0,0);
        scene.add(camera);

        const controls = new TrackballControls(camera, elem);
        controls.noZoom = true;
        controls.noPan = true;

        {
            const colour = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.DirectionalLight(colour, intensity);
            light.position.set(-1,2,4);
            camera.add(light);
        }

        return {scene,camera,controls};
    }

    const sceneInitFunction = { 
        any: (elem) => {
            const {scene,camera,controls} = makeScene(elem);
            const radius = 0.8;
            const widthSegments = 20;
            const heightSegments = 7;
            const geometry = new THREE.SphereGeometry(radius,widthSegments,heightSegments);
            const material = new THREE.MeshPhongMaterial({
                color:'green',
                flatShading:true,
            });
            const mesh = new THREE.Mesh(geometry,material);
            scene.add(mesh);

            return (time,rect) => {
                mesh.rotation.y = time * 0.1;
                camera.aspect = rect.width / rect.height;
                camera.updateProjectionMatrix();
                controls.handleResize();
                controls.update();
                renderer.render(scene,camera);
            };
        },
    }

    document.querySelectorAll('[data-diagram]').forEach
}

main();