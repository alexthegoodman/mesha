import MeshaCanvas from "./interface/MeshaCanvas";
import Cube from "./nodes/mesh/Cube";
import Triangle from "./nodes/mesh/Triangle";
import BasicCamera from "./renderer/cameras/BasicCamera";
import BasicPipeline from "./renderer/pipelines/BasicPipeline";

export default class MeshaCore {
  public pipeline: BasicPipeline | null = null;
  public camera: BasicCamera | null = null;

  constructor() {}

  async initialize(canvasElement: HTMLCanvasElement) {
    const meshaCanvas = new MeshaCanvas();
    await meshaCanvas.initialize(canvasElement);

    this.camera = new BasicCamera(meshaCanvas);

    // const triangle = new Triangle(meshaCanvas);
    // await triangle.initialize();

    const cube = new Cube(meshaCanvas);
    await cube.initialize();

    // const pyramid = new Pyramid(meshaCanvas);
    // await pyramid.initialize();

    // const meshaScene = new MeshaScene();
    // await meshaScene.initialize([pyramid, cube]);

    this.pipeline = new BasicPipeline(meshaCanvas, this.camera, [cube]);
    await this.pipeline.initialize();

    this.run();
  }

  run = () => {
    if (!this.pipeline) {
      throw new Error("Pipeline not found");
    }

    if (!this.camera) {
      throw new Error("Camera not found");
    }

    this.camera.update();

    this.pipeline.startRenderPass();

    requestAnimationFrame(this.run);
  };
}
