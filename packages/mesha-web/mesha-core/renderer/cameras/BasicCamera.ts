import MeshaCanvas from "../../interface/MeshaCanvas";
import { vec3, mat4 } from "gl-matrix";

export default class BasicCamera {
  public meshaCanvas: MeshaCanvas;

  constructor(meshaCanvas: MeshaCanvas) {
    this.meshaCanvas = meshaCanvas;
  }

  createViewProjection(
    aspectRatio = 1.0,
    cameraPosition: vec3 = [2, 2, 4],
    lookDirection: vec3 = [0, 0, 0],
    upDirection: vec3 = [0, 1, 0]
  ) {
    const viewMatrix = mat4.create();
    const projectionMatrix = mat4.create();
    const viewProjectionMatrix = mat4.create();

    mat4.perspective(
      projectionMatrix,
      (2 * Math.PI) / 5,
      aspectRatio,
      0.1,
      100.0
    );

    mat4.lookAt(viewMatrix, cameraPosition, lookDirection, upDirection);

    mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);

    const cameraOption = {
      eye: cameraPosition,
      center: lookDirection,
      zoomMax: 100,
      zoomSpeed: 2,
    };

    return {
      viewMatrix,
      projectionMatrix,
      viewProjectionMatrix,
      cameraOption,
    };
  }

  createTransforms(
    modelMat: mat4,
    translation: vec3 = [0, 0, 0],
    rotation: vec3 = [0, 0, 0],
    scaling: vec3 = [1, 1, 1]
  ) {
    const rotateXMat = mat4.create();
    const rotateYMat = mat4.create();
    const rotateZMat = mat4.create();
    const translateMat = mat4.create();
    const scaleMat = mat4.create();

    // perform individual transformations
    mat4.fromTranslation(translateMat, translation);
    mat4.fromXRotation(rotateXMat, rotation[0]);
    mat4.fromYRotation(rotateYMat, rotation[1]);
    mat4.fromZRotation(rotateZMat, rotation[2]);
    mat4.fromScaling(scaleMat, scaling);

    // combine transformations
    mat4.multiply(modelMat, rotateXMat, scaleMat);
    mat4.multiply(modelMat, rotateYMat, modelMat);
    mat4.multiply(modelMat, rotateZMat, modelMat);
    mat4.multiply(modelMat, translateMat, modelMat);
  }

  createUniformData() {
    if (!this.meshaCanvas.canvas) {
      throw new Error("Canvas not found");
    }

    const { width, height } = this.meshaCanvas.canvas;
    const modelMatrix = mat4.create();
    const mvpMatrix = mat4.create();
    let vpMatrix = mat4.create();
    const vp = this.createViewProjection(width / height);
    vpMatrix = vp.viewProjectionMatrix;

    return { modelMatrix, mvpMatrix, vpMatrix };
  }
}
