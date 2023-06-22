import { mat4, vec3 } from "gl-matrix";
import MeshaCanvas from "../interface/MeshaCanvas";
import { GPUBufferUsage } from "../def/gpu";

export default class MeshaNode {
  public meshaCanvas: MeshaCanvas;
  public bufferLayouts: Iterable<GPUVertexBufferLayout> | null = null;

  constructor(meshaCanvas: MeshaCanvas) {
    this.meshaCanvas = meshaCanvas;
  }

  start() {
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

  createModelMatrix(
    translation: vec3 = [0, 0, 0],
    rotation: vec3 = [0, 0, 0],
    scaling: vec3 = [1, 1, 1]
  ) {
    const modelMatrix = mat4.create();
    const rotateXMatrix = mat4.create();
    const rotateYMatrix = mat4.create();
    const rotateZMatrix = mat4.create();
    const translateMatrix = mat4.create();
    const scaleMat = mat4.create();

    // perform individual transformations
    mat4.fromTranslation(translateMatrix, translation);
    mat4.fromXRotation(rotateXMatrix, rotation[0]);
    mat4.fromYRotation(rotateYMatrix, rotation[1]);
    mat4.fromZRotation(rotateZMatrix, rotation[2]);
    mat4.fromScaling(scaleMat, scaling);

    // combine transformations
    mat4.multiply(modelMatrix, rotateXMatrix, scaleMat);
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
