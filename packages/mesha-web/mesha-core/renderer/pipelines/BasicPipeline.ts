import Triangle from "../../nodes/mesh/Triangle";
import MeshaCanvas from "../../interface/MeshaCanvas";
import BasicShader from "../shaders/BasicShader.wgsl?raw";
import Cube from "../../nodes/mesh/Cube";
import { GPUBufferUsage, GPUTextureUsage } from "../../def/gpu";
import BasicCamera from "../cameras/BasicCamera";
import { mat4 } from "gl-matrix";

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
  private uniformBuffer: GPUBuffer | null = null;

  public cube: Cube;

  constructor(meshaCanvas: MeshaCanvas, cube: Cube) {
    this.meshaCanvas = meshaCanvas;
    this.cube = cube;
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

    if (!this.cube.bufferLayouts) {
      throw new Error("Cube BufferLayouts not found");
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
        buffers: this.cube.bufferLayouts,
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
      depthStencil: {
        format: "depth24plus",
        depthWriteEnabled: true,
        depthCompare: "less",
      },
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

    if (!this.meshaCanvas.canvas) {
      throw new Error("Canvas not found");
    }

    const depthTexture = this.meshaCanvas.device?.createTexture({
      size: [this.meshaCanvas.canvas.width, this.meshaCanvas.canvas.height, 1],
      format: "depth24plus",
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });

    if (!depthTexture) {
      throw new Error("DepthTexture creation failed");
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
      depthStencilAttachment: {
        view: depthTexture.createView(),
        depthClearValue: 1,
        depthLoadOp: "clear" as "clear",
        depthStoreOp: "store" as "store",
        stencilClearValue: 0,
        // stencilLoadOp: "clear" as "clear",
        // stencilStoreOp: "store" as "store",
      },
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

    const basicCamera = new BasicCamera(this.meshaCanvas);
    const { modelMatrix, mvpMatrix, vpMatrix } =
      basicCamera.createUniformData();
    basicCamera.createTransforms(modelMatrix);

    mat4.multiply(mvpMatrix, vpMatrix, modelMatrix);

    if (!this.uniformBuffer) {
      throw new Error("UniformBuffer not found");
    }

    this.meshaCanvas.device.queue.writeBuffer(
      this.uniformBuffer,
      0,
      mvpMatrix as ArrayBuffer
    );

    const vertexCount = this.cube.vertices.length / 3;

    this.renderPass.setPipeline(this.renderPipeline);
    this.renderPass.setBindGroup(0, this.bindGroup);
    this.renderPass.setVertexBuffer(0, this.cube.vertexBuffer);
    this.renderPass.setVertexBuffer(1, this.cube.colorBuffer);
    this.renderPass.draw(vertexCount);
    this.renderPass.end();

    this.meshaCanvas.device.queue.submit([this.commandEncoder.finish()]);
  }

  // the purpose of layout is to bind data to the shaders
  initLayouts() {
    if (!this.meshaCanvas.device) {
      throw new Error("GPUDevice not found");
    }

    this.bindGroupLayout = this.meshaCanvas.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          // type: "uniform-buffer" as "uniform-buffer",
          buffer: {
            type: "uniform" as "uniform",
          },
        },
      ],
    });

    this.pipelineLayout = this.meshaCanvas.device.createPipelineLayout({
      bindGroupLayouts: [this.bindGroupLayout],
    });

    this.uniformBuffer = this.meshaCanvas.device.createBuffer({
      size: 4 * 16,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.bindGroup = this.meshaCanvas.device.createBindGroup({
      layout: this.bindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this.uniformBuffer,
            offset: 0,
            size: 4 * 16,
          },
        },
      ],
    });
  }
}
