import MeshaCanvas from "./interface/MeshaCanvas";
import Triangle from "./nodes/mesh/Triangle";
import BasicPipeline from "./renderer/pipelines/BasicPipeline";

export default class MeshaCore {
  constructor() {}

  async initialize(canvasElement: HTMLCanvasElement) {
    const meshaCanvas = new MeshaCanvas();
    await meshaCanvas.initialize(canvasElement);

    const triangle = new Triangle(meshaCanvas);
    await triangle.initialize();

    const basicPipeline = new BasicPipeline(meshaCanvas, triangle);
    await basicPipeline.initialize();
    await basicPipeline.drawRenderPass();
  }
}
