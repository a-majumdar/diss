// import { Clock } from "three";

// const clock = new Clock();

class Loop {

    interval;
    flag;

    constructor(camera, scene, renderer) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.flag = true;
        // this.updatables = [];
    }

    start(object, delay) {

        // this.renderer.setAnimationLoop(() => {
        //     this.interval = setInterval(function () {console.log('tick');}, 2000); //object.tick()
        //     // this.tick(object);
        //     // this.renderer.render(this.scene, this.camera);
        // });
        this.interval = setInterval(function() {object.tick();}, delay);
        this.flag = false;

    }


    stop() {

        clearInterval(this.interval);
        this.flag = true;
        // this.renderer.setAnimationLoop(null);

    }

    // changeSpeed(object) {

    //     this.stop;
    //     this.start(object);

    // }

}

export { Loop };