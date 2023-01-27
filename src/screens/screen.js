import { createCamera } from '../components/camera.js';
import { createScene } from '../components/scene.js';
import { Loop } from '../systems/loop.js';
import { createRenderer } from '../systems/renderer.js';
import { Resizer } from '../systems/resizer.js';


class Screen {

    scene;
    nodes;
    counter;
    step;
    container;
    camera;
    renderer;
    loop;

    constructor(c) {
        this.nodes = [];
        this.counter = 0;
        this.step = 1;
        
        let container = c;
        
        this.scene = createScene();
        this.camera = createCamera(); //maybe use OrthographicCamera for 2d scenes or user interfaces?
        this.renderer = createRenderer();
        this.loop = new Loop(this.camera, this.scene, this.renderer);
        
        container.append(this.renderer.domElement);

        const resizer = new Resizer(container, this.camera, this.renderer);
        resizer.onResize = () => {
            this.render();
        };

    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    start() {
        this.loop.start();
    }

    stop() {
        this.loop.stop();
    }

}

export {Screen};