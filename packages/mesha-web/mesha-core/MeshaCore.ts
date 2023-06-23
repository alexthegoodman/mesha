import MeshaCanvas from "./interface/MeshaCanvas";
import Cube from "./nodes/mesh/Cube";
import Pyramid from "./nodes/mesh/Pyramid";
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

    const cube = new Cube(meshaCanvas);
    await cube.initialize();

    cube.position = [0, 0, -5];

    const cube2 = new Cube(meshaCanvas);
    await cube2.initialize();

    cube2.position = [0, 0, 0];

    const pyramid = new Pyramid(meshaCanvas);
    await pyramid.initialize();

    pyramid.position = [0, 0, 5];

    this.pipeline = new BasicPipeline(meshaCanvas, this.camera, [
      cube,
      pyramid,
      cube2,
    ]);
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
