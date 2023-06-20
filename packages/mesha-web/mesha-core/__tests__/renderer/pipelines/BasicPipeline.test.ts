import { describe, expect, test, vi } from "vitest";
import BasicPipeline from "../../../renderer/pipelines/BasicPipeline";
import MeshaCanvas from "../../../interface/MeshaCanvas";
import { navigator } from "../../stubs/gpu";

vi.stubGlobal("navigator", navigator);

describe("BasicPipeline", () => {
  test("should create BasicPipeline class with appropriate properties", async () => {
    const canvasElement = document.createElement("canvas");
    const meshaCanvas = new MeshaCanvas();

    await meshaCanvas.initialize(canvasElement);

    const basicPipeline = new BasicPipeline(meshaCanvas);

    basicPipeline.initLayouts = vi.fn(() => ({})) as any;

    await basicPipeline.initialize();

    expect(basicPipeline).toBeDefined();
    expect(basicPipeline).toBeInstanceOf(BasicPipeline);
    expect(basicPipeline).toHaveProperty("meshaCanvas");
    expect(basicPipeline).toHaveProperty("renderPipeline");
    expect(basicPipeline).toHaveProperty("commandEncoder");

    expect(basicPipeline.meshaCanvas).toBeInstanceOf(MeshaCanvas);
    expect(basicPipeline.renderPipeline).not.toBeNull();
    expect(basicPipeline.commandEncoder).not.toBeNull();
  });
  test("should create a correct pipeline configuration", async () => {
    const canvasElement = document.createElement("canvas");
    const meshaCanvas = new MeshaCanvas();

    await meshaCanvas.initialize(canvasElement);

    const basicPipeline = new BasicPipeline(meshaCanvas);

    basicPipeline.initLayouts = vi.fn(() => ({})) as any;

    await basicPipeline.initialize();

    const pipelineConfiguration = basicPipeline.getPipelineConfiguration();

    expect(pipelineConfiguration).toBeDefined();
    expect(pipelineConfiguration.vertex.entryPoint).toEqual("main_vertex");
    expect(pipelineConfiguration.fragment?.entryPoint).toEqual("main_fragment");
    expect(pipelineConfiguration.primitive?.topology).toEqual("triangle-list");
  });
  test("should draw a render pass", async () => {
    const canvasElement = document.createElement("canvas");
    const meshaCanvas = new MeshaCanvas();

    await meshaCanvas.initialize(canvasElement);

    const basicPipeline = new BasicPipeline(meshaCanvas);

    basicPipeline.meshaCanvas.device = {
      queue: {
        submit: vi.fn(() => ({})),
      },
      createBindGroupLayout: vi.fn(() => ({})),
      createBindGroup: vi.fn(() => ({})),
      createPipelineLayout: vi.fn(() => ({})),
      createShaderModule: vi.fn(() => ({})),
      createRenderPipeline: vi.fn(() => ({})),
      createCommandEncoder: vi.fn(() => ({})),
    } as any;

    await basicPipeline.initialize();

    basicPipeline.meshaCanvas.context = {
      getCurrentTexture: vi.fn(() => ({
        createView: vi.fn(() => ({})),
      })),
    } as any;

    basicPipeline.commandEncoder = {
      beginRenderPass: vi.fn(() => ({
        setPipeline: vi.fn(() => ({})),
        draw: vi.fn(() => ({})),
        end: vi.fn(() => ({})),
        setBindGroup: vi.fn(() => ({})),
      })),
      finish: vi.fn(() => ({})),
    } as any;

    await basicPipeline.drawRenderPass();

    expect(basicPipeline.commandEncoder?.beginRenderPass).toHaveBeenCalled();
    expect(basicPipeline.commandEncoder?.finish).toHaveBeenCalled();
    expect(basicPipeline.meshaCanvas.device?.queue.submit).toHaveBeenCalled();
  });
});
