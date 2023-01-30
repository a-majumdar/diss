// import { Clock } from "three";

// const clock = new Clock();

class Loop {

    constructor(camera, scene, renderer) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        // this.updatables = [];
    }

    start(object) {

        this.renderer.setAnimationLoop(() => {
            this.tick(object);
            this.renderer.render(this.scene, this.camera);
        });

    }

    stop() {

        this.renderer.setAnimationLoop(null);

    }

    tick(object) {

        // const delta = clock.getDelta();
        object.tick();


    }

}

export { Loop };