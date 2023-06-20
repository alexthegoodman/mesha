import { GPUBufferUsage } from "../../../mesha-core/def/gpu";
import MeshaCanvas from "../../interface/MeshaCanvas";
import MeshaNode from "../MeshaNode";

export default class Triangle extends MeshaNode {
  public meshaCanvas: MeshaCanvas;
  public buffer: GPUBuffer | null = null;
  public bufferLayout: GPUVertexBufferLayout | null = null;

  // prettier-ignore
  public vertices: Float32Array = new Float32Array([
    // x y r g b
    0.0, 0.5, 1.0, 0.0, 0.0,
    -0.5, -0.5, 0.0, 1.0, 0.0,
    0.5, -0.5, 0.0, 0.0, 1.0,
  ]);

  constructor(meshaCanvas: MeshaCanvas) {
    super();
    this.meshaCanvas = meshaCanvas;
  }

  async initialize() {
    this.createBuffer();

    // specify binding of vertices to shader
    this.bufferLayout = {
      arrayStride: 20,
      stepMode: "vertex",
      attributes: [
        // x y
        {
          shaderLocation: 0,
          offset: 0,
          format: "float32x2",
        },
        // r g b
        {
          shaderLocation: 1,
          offset: 8,
          format: "float32x3",
        },
      ] as Iterable<GPUVertexAttribute>,
    };
  }

  // create space in GPU for vertices
  createBuffer() {
    if (!this.meshaCanvas.device) {
      throw new Error("GPUDevice not found");
    }

    const usage: GPUBufferUsageFlags =
      GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST;

    const bufferConfiguration: GPUBufferDescriptor = {
      size: this.vertices.byteLength,
      usage,
      mappedAtCreation: true,
    };

    this.buffer = this.meshaCanvas.device.createBuffer(bufferConfiguration);
    new Float32Array(this.buffer.getMappedRange()).set(this.vertices);
    this.buffer.unmap();
  }
}
