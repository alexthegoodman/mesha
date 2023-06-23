import { colors, vertices } from "../../def/cube";
import MeshaCanvas from "../../interface/MeshaCanvas";
import MeshaNode from "../MeshaNode";

export default class Cube extends MeshaNode {
  public meshaCanvas: MeshaCanvas;

  public vertices: Float32Array = vertices;
  public colors: Float32Array = colors;

  constructor(meshaCanvas: MeshaCanvas) {
    super(meshaCanvas);
    this.meshaCanvas = meshaCanvas;
  }

  async initialize() {
    this.vertexBuffer = this.createBuffer(this.vertices);
    this.colorBuffer = this.createBuffer(this.colors);

    this.start();
  }
}
