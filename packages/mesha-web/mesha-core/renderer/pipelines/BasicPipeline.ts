import MeshaCanvas from "../../interface/MeshaCanvas";
import BasicShader from "../shaders/BasicShader.wgsl?raw";

/**
 * BasicPipeline
 * How to use: BasicPipeline is meant to be initialized followed by drawing render passes.
 * Purpose: encapsulate GPU data submission (pipeline)
 */
export default class BasicPipeline {
  public meshaCanvas: MeshaCanvas;
  public renderPipeline: GPURenderPipeline | null = null;
  public commandEncoder: GPUCommandEncoder | null = null;
  public renderPass: GPURenderPassEncoder | null = null;

  private pipelineLayout: GPUPipelineLayout | "auto" = "auto";
  private bindGroupLayout: GPUBindGroupLayout | null = null;
  private bindGroup: GPUBindGroup | null = null;

  constructor(meshaCanvas: MeshaCanvas) {
    this.meshaCanvas = meshaCanvas;
  }

  // prepare the pipeline for drawing render passes
  async initialize() {
    if (!this.meshaCanvas.device) {
      throw new Error("GPUDevice not found");
    }

    this.initLayouts();

    const pipelineConfiguration = this.getPipelineConfiguration();

    this.renderPipeline = this.meshaCanvas.device.createRenderPipeline(
      pipelineConfiguration
    );

    if (!this.renderPipeline) {
      throw new Error("RenderPipeline creation failed");
    }

    this.commandEncoder = this.meshaCanvas.device.createCommandEncoder();

    if (!this.commandEncoder) {
      throw new Error("CommandEncoder creation failed");
    }
  }

  // configure the shaders and binding layout for the pipeline
  getPipelineConfiguration() {
    if (!this.meshaCanvas.device) {
      throw new Error("GPUDevice not found");
    }

    const vertexShaderModule = this.meshaCanvas.device.createShaderModule({
      code: BasicShader,
    });

    const fragmentShaderModule = this.meshaCanvas.device.createShaderModule({
      code: BasicShader,
    });

    const pipelineConfiguration: GPURenderPipelineDescriptor = {
      vertex: {
        module: vertexShaderModule,
        entryPoint: "main_vertex",
      },
      fragment: {
        module: fragmentShaderModule,
        entryPoint: "main_fragment",
        targets: [
          {
            format: this.meshaCanvas.format,
          },
        ],
      },
      primitive: {
        topology: "triangle-list",
      },
      layout: this.pipelineLayout,
    };

    return pipelineConfiguration;
  }

  // here we define some smart defaults for the render pass
  getRenderPassConfiguration() {
    const textureView = this.meshaCanvas.context
      ?.getCurrentTexture()
      .createView();

    if (!textureView) {
      throw new Error("TextureView fetch failed");
    }

    const renderPassConfiguration: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: textureView,
          clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
          loadOp: "clear" as "clear",
          storeOp: "store" as "store",
        },
      ],
    };

    return renderPassConfiguration;
  }

  // the purpose of drawRenderPass is to actually submit data to the GPU
  drawRenderPass() {
    if (!this.meshaCanvas.device) {
      throw new Error("GPUDevice not found");
    }

    if (!this.commandEncoder) {
      throw new Error("CommandEncoder not found");
    }

    if (!this.renderPipeline) {
      throw new Error("RenderPipeline not found");
    }

    const renderPassConfiguration = this.getRenderPassConfiguration();

    this.renderPass = this.commandEncoder.beginRenderPass(
      renderPassConfiguration
    );

    if (!this.renderPass) {
      throw new Error("RenderPass creation failed");
    }

    this.renderPass.setPipeline(this.renderPipeline);
    this.renderPass.setBindGroup(0, this.bindGroup);
    this.renderPass.draw(3, 1, 0, 0);
    this.renderPass.end();

    this.meshaCanvas.device.queue.submit([this.commandEncoder.finish()]);
  }

  // the purpose of layout is to bind data to the shaders
  initLayouts() {
    if (!this.meshaCanvas.device) {
      throw new Error("GPUDevice not found");
    }

    this.bindGroupLayout = this.meshaCanvas.device.createBindGroupLayout({
      entries: [],
    });

    this.pipelineLayout = this.meshaCanvas.device.createPipelineLayout({
      bindGroupLayouts: [this.bindGroupLayout],
    });

    this.bindGroup = this.meshaCanvas.device.createBindGroup({
      layout: this.bindGroupLayout,
      entries: [],
    });
  }
}
