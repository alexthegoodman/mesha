import { colors, vertices } from "../../def/cube";
import { GPUBufferUsage } from "../../def/gpu";
import MeshaCanvas from "../../interface/MeshaCanvas";
import MeshaNode from "../MeshaNode";

export default class Cube extends MeshaNode {
  public meshaCanvas: MeshaCanvas;
  public vertexBuffer: GPUBuffer | null = null;
  public colorBuffer: GPUBuffer | null = null;
  public bufferLayouts: Iterable<GPUVertexBufferLayout> | null = null;

  public vertices: Float32Array = vertices;
  public colors: Float32Array = colors;

  constructor(meshaCanvas: MeshaCanvas) {
    super();
    this.meshaCanvas = meshaCanvas;
  }

  async initialize() {
    this.vertexBuffer = this.createBuffer(this.vertices);
    this.colorBuffer = this.createBuffer(this.colors);

    // specify binding of vertices to shader
    this.bufferLayouts = [
      {
        arrayStride: 3 * 4,
        attributes: [
          {
            shaderLocation: 0,
            offset: 0,
            format: "float32x3",
          },
        ] as GPUVertexAttribute[],
      },
      {
        arrayStride: 3 * 4,
        attributes: [
          {
            shaderLocation: 1,
            offset: 0,
            format: "float32x3",
          },
        ] as GPUVertexAttribute[],
      },
    ];
  }

  // create space in GPU for vertices
  createBuffer(data: Float32Array) {
    if (!this.meshaCanvas.device) {
      throw new Error("GPUDevice not found");
    }

    const usage: GPUBufferUsageFlags =
      GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST;

    const bufferConfiguration: GPUBufferDescriptor = {
      size: data.byteLength,
      usage,
      mappedAtCreation: true,
    };

    const buffer = this.meshaCanvas.device.createBuffer(bufferConfiguration);
    new Float32Array(buffer.getMappedRange()).set(data);
    buffer.unmap();

    return buffer;
  }
}
