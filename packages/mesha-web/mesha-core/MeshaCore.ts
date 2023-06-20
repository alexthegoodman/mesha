import MeshaCanvas from "./interface/MeshaCanvas";
import Cube from "./nodes/mesh/Cube";
import Triangle from "./nodes/mesh/Triangle";
import BasicPipeline from "./renderer/pipelines/BasicPipeline";

export default class MeshaCore {
  constructor() {}

  async initialize(canvasElement: HTMLCanvasElement) {
    const meshaCanvas = new MeshaCanvas();
    await meshaCanvas.initialize(canvasElement);

    // const triangle = new Triangle(meshaCanvas);
    // await triangle.initialize();

    const cube = new Cube(meshaCanvas);
    await cube.initialize();

    const basicPipeline = new BasicPipeline(meshaCanvas, cube);
    await basicPipeline.initialize();
    await basicPipeline.drawRenderPass();
  }
}
