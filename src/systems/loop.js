// import { Clock } from "three";

// const clock = new Clock();

class Loop {

    interval;

    constructor(camera, scene, renderer) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        // this.updatables = [];
    }

    start(object) {

        // this.renderer.setAnimationLoop(() => {
        //     this.interval = setInterval(function () {console.log('tick');}, 2000); //object.tick()
        //     // this.tick(object);
        //     // this.renderer.render(this.scene, this.camera);
        // });
        this.interval = setInterval(function() {object.tick();}, 700);

    }

    stop() {

        clearInterval(this.interval);
        // this.renderer.setAnimationLoop(null);

    }

    // changeSpeed(object) {

    //     this.stop;
    //     this.start(object);

    // }

}

export { Loop };