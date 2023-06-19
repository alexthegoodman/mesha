export default class MeshaCanvas {
  public canvas: HTMLCanvasElement | null = null;
  public adapter: GPUAdapter | null = null;
  public device: GPUDevice | null = null;
  public context: GPUCanvasContext | null = null;
  public format: GPUTextureFormat = "bgra8unorm";

  constructor() {}

  async initialize(canvasElement: HTMLCanvasElement) {
    this.canvas = canvasElement;

    if (!this.canvas) {
      throw new Error("Canvas element not found");
    }

    if (!navigator.gpu) {
      throw new Error("WebGPU not supported");
    }

    this.adapter = await navigator.gpu.requestAdapter();

    if (!this.adapter) {
      throw new Error("GPUAdapter not found");
    }

    this.device = await this.adapter.requestDevice();

    if (!this.device) {
      throw new Error("GPUDevice not found");
    }

    this.context = this.canvas.getContext("webgpu");
    this.format = navigator.gpu.getPreferredCanvasFormat();

    this.configureContext();
  }

  configureContext() {
    if (!this.device) {
      throw new Error("Canvas context could not be configured");
    }

    this.context?.configure({
      device: this.device,
      format: this.format,
    });
  }
}
