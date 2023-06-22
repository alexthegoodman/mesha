import BasicMath from "../../helpers/BasicMath";
import MeshaCanvas from "../../interface/MeshaCanvas";
import { vec3, mat4, vec4 } from "gl-matrix";

export default class BasicCamera {
  public meshaCanvas: MeshaCanvas;
  public cameraPosition: vec3 = [-10, 0, 0];
  public cameraRotation: vec3 = [0, 0, 0];
  public lookDirection: vec3 = [0, 0, 0];
  public upDirection: vec3 = [0, 1, 0];
  public aspectRatio: number;

  public forwards: vec3 = [0, 0, 0];
  public right: vec3 = [0, 0, 0];
  public up: vec3 = [0, 0, 0];

  public fovy: number = (2 * Math.PI) / 5;
  public near: number = 0.1;
  public far: number = 100.0;

  public rotationActive: boolean = false;

  constructor(meshaCanvas: MeshaCanvas) {
    this.meshaCanvas = meshaCanvas;

    if (!this.meshaCanvas.canvas) {
      throw new Error("Canvas not found");
    }

    const { width, height } = this.meshaCanvas.canvas;
    this.aspectRatio = width / height;
    this.createControls();
  }

  createVPMatrix() {
    const viewMatrix = mat4.create();
    const projectionMatrix = mat4.create();
    const vpMatrix = mat4.create();

    mat4.perspective(
      projectionMatrix,
      this.fovy,
      this.aspectRatio,
      this.near,
      this.far
    );

    mat4.lookAt(
      viewMatrix,
      this.cameraPosition,
      this.lookDirection,
      this.upDirection
    );

    mat4.multiply(vpMatrix, projectionMatrix, viewMatrix);

    return {
      viewMatrix,
      projectionMatrix,
      vpMatrix,
    };
  }

  // create the model view projection matrix
  createMVPMatrix(vpMatrix: mat4, modelMatrix: mat4) {
    const mvpMatrix = mat4.create();

    mat4.multiply(mvpMatrix, vpMatrix, modelMatrix);

    return mvpMatrix;
  }

  update() {
    const basicMath = new BasicMath();

    // calculate forwards vector for calculating lookDirection
    this.forwards = [
      Math.cos(basicMath.degreesToRadians(this.cameraRotation[2])) *
        Math.cos(basicMath.degreesToRadians(this.cameraRotation[1])),
      Math.sin(basicMath.degreesToRadians(this.cameraRotation[2])) *
        Math.cos(basicMath.degreesToRadians(this.cameraRotation[1])),
      Math.sin(basicMath.degreesToRadians(this.cameraRotation[1])),
    ];

    this.right = vec3.create();
    this.up = vec3.create();

    vec3.cross(this.right, this.forwards, this.upDirection);
    vec3.cross(this.up, this.right, this.forwards);

    const target = vec3.create();
    vec3.add(target, this.cameraPosition, this.forwards);

    vec3.add(this.lookDirection, this.cameraPosition, this.forwards);
  }

  createControls() {
    if (!this.meshaCanvas.canvas) {
      throw new Error("Canvas not found");
    }

    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowUp":
          this.moveCamera(0.1, 0);
          break;
        case "ArrowDown":
          this.moveCamera(-0.1, 0);
          break;
        case "ArrowLeft":
          // this.cameraPosition[1] += 0.1;
          this.moveCamera(0, 0.1);
          break;
        case "ArrowRight":
          // this.cameraPosition[1] -= 0.1;
          this.moveCamera(0, -0.1);
          break;
        case "w":
          // this.cameraPosition[2] += 0.1;
          this.moveCamera(0.1, 0);
          break;
        case "s":
          // this.cameraPosition[2] -= 0.1;
          this.moveCamera(-0.1, 0);
          break;
        case "a":
          // this.cameraRotation[2] += 0.1;
          this.moveCamera(0, 0.1);
          break;
        case "d":
          // this.cameraRotation[2] -= 0.1;
          this.moveCamera(0, -0.1);
          break;
        case "q":
          // this.cameraRotation[1] += 0.1;
          this.spinCamera(0.1, 0);
          break;
        case "e":
          // this.cameraRotation[1] -= 0.1;
          this.spinCamera(-0.1, 0);
          break;
      }
    });

    // this.meshaCanvas.canvas.addEventListener("wheel", (event) => {

    this.meshaCanvas.canvas.addEventListener("mousedown", (event) => {
      // this.meshaCanvas.canvas.requestPointerLock();
      this.rotationActive = true;
    });

    this.meshaCanvas.canvas.addEventListener("mouseup", (event) => {
      this.rotationActive = false;
    });

    this.meshaCanvas.canvas.addEventListener("mouseleave", (event) => {
      this.rotationActive = false;
    });

    this.meshaCanvas.canvas.addEventListener("mousemove", (event) => {
      if (!this.rotationActive) {
        return;
      }

      const { movementX, movementY } = event;

      this.spinCamera(movementX / 5, movementY / 5);

      // this.cameraRotation[2] += movementX / 5;
      // this.cameraRotation[1] += movementY / 5;

      // console.info("cameraRotation", this.cameraRotation);
    });
  }

  spinCamera(dY: number, dX: number) {
    this.cameraRotation[2] -= dX;
    this.cameraRotation[2] %= 360;

    this.cameraRotation[1] = Math.min(
      89,
      Math.max(-89, this.cameraRotation[1] + dY)
    );
  }

  moveCamera(forward: number, right: number) {
    vec3.scaleAndAdd(
      this.cameraPosition,
      this.cameraPosition,
      this.forwards,
      forward
    );

    vec3.scaleAndAdd(
      this.cameraPosition,
      this.cameraPosition,
      this.right,
      right
    );
  }
}
