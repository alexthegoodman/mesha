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
    const vpMatrix = mat4.create();

    mat4.perspective(
      projectionMatrix,
      (2 * Math.PI) / 5,
      aspectRatio,
      0.1,
      100.0
    );

    mat4.lookAt(viewMatrix, cameraPosition, lookDirection, upDirection);

    mat4.multiply(vpMatrix, projectionMatrix, viewMatrix);

    // const cameraOption = {
    //   eye: cameraPosition,
    //   center: lookDirection,
    //   zoomMax: 100,
    //   zoomSpeed: 2,
    // };

    return {
      viewMatrix,
      projectionMatrix,
      vpMatrix,
      // cameraOption,
    };
  }

  createTransforms(
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

  // create the model view projection matrix
  createMVPMatrix() {
    if (!this.meshaCanvas.canvas) {
      throw new Error("Canvas not found");
    }

    const { width, height } = this.meshaCanvas.canvas;

    const mvpMatrix = mat4.create();

    // view projection matrix shows the world from the camera's perspective
    const { vpMatrix } = this.createViewProjection(width / height);

    // model matrix shows the world from the object's perspective
    const modelMatrix = this.createTransforms();

    // mvp matrix orients the object in the world
    mat4.multiply(mvpMatrix, vpMatrix, modelMatrix);

    return { modelMatrix, mvpMatrix, vpMatrix };
  }
}
