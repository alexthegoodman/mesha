import { mat4, vec3 } from "gl-matrix";
import MeshaCanvas from "../interface/MeshaCanvas";
import { GPUBufferUsage } from "../def/gpu";

// TODO: MeshNode and GenericNode
export default class MeshaNode {
  public name: string = "MeshaNode";
  public meshaCanvas: MeshaCanvas;
  public bufferLayouts: Iterable<GPUVertexBufferLayout> | null = null;

  public vertexBuffer: GPUBuffer | null = null;
  public colorBuffer: GPUBuffer | null = null;

  public vertices: Float32Array = new Float32Array();
  public colors: Float32Array = new Float32Array();

  public position: vec3 = [0, 0, 0];
  public rotation: vec3 = [0, 0, 0];
  public scale: vec3 = [1, 1, 1];

  constructor(meshaCanvas: MeshaCanvas) {
    this.meshaCanvas = meshaCanvas;
  }

  start() {}

  createModelMatrix() {
    const modelMatrix = mat4.create();
    const rotateXMatrix = mat4.create();
    const rotateYMatrix = mat4.create();
    const rotateZMatrix = mat4.create();
    const translateMatrix = mat4.create();
    const scaleMatrix = mat4.create();

    // perform individual transformations
    mat4.fromTranslation(translateMatrix, this.position);
    mat4.fromXRotation(rotateXMatrix, this.rotation[0]);
    mat4.fromYRotation(rotateYMatrix, this.rotation[1]);
    mat4.fromZRotation(rotateZMatrix, this.rotation[2]);
    mat4.fromScaling(scaleMatrix, this.scale);

    // combine transformations
    mat4.multiply(modelMatrix, rotateXMatrix, scaleMatrix);
    mat4.multiply(modelMatrix, rotateYMatrix, modelMatrix);
    mat4.multiply(modelMatrix, rotateZMatrix, modelMatrix);
    mat4.multiply(modelMatrix, translateMatrix, modelMatrix);

    return modelMatrix;
  }

  // create space in GPU for vertices
  createBuffer(data: Float32Array) {
    if (!this.meshaCanvas.device) {
      throw new Error("GPUDevice not found");
    }

    const usage: GPUBufferUsageFlags =
      GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST;

    const bufferConfiguration: GPUBufferDescriptor = {
      size: data.byteLength * 2,
      usage,
      mappedAtCreation: true,
    };

    const buffer = this.meshaCanvas.device.createBuffer(bufferConfiguration);
    new Float32Array(buffer.getMappedRange()).set(data);
    buffer.unmap();

    return buffer;
  }
}
