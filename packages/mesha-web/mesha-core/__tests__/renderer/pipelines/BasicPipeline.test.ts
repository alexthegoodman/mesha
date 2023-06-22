import { beforeEach, describe, expect, test, vi } from "vitest";
import BasicPipeline from "../../../renderer/pipelines/BasicPipeline";
import MeshaCanvas from "../../../interface/MeshaCanvas";
import { navigator } from "../../stubs/gpu";
import BasicCamera from "../../../renderer/cameras/BasicCamera";
import Cube from "../../../nodes/mesh/Cube";
import { mockCanvas } from "../../stubs/canvas";

vi.stubGlobal("navigator", navigator);

describe("BasicPipeline", () => {
  let basicPipeline: BasicPipeline;
  beforeEach(async () => {
    const meshaCanvas = new MeshaCanvas();
    await meshaCanvas.initialize(mockCanvas);
    const basicCamera = new BasicCamera(meshaCanvas);
    const cube = new Cube(meshaCanvas);
    cube.createBuffer = vi.fn(() => ({})) as any;
    await cube.initialize();

    basicPipeline = new BasicPipeline(meshaCanvas, basicCamera, cube);

    basicPipeline.initLayouts = vi.fn(() => ({})) as any;

    await basicPipeline.initialize();
  });

  test("should create BasicPipeline class with appropriate properties", async () => {
    expect(basicPipeline).toBeDefined();
    expect(basicPipeline).toBeInstanceOf(BasicPipeline);
    expect(basicPipeline).toHaveProperty("meshaCanvas");
    expect(basicPipeline).toHaveProperty("renderPipeline");

    expect(basicPipeline.meshaCanvas).toBeInstanceOf(MeshaCanvas);
    expect(basicPipeline.renderPipeline).not.toBeNull();
  });
  test("should create a correct pipeline configuration", async () => {
    const pipelineConfiguration = basicPipeline.getPipelineConfiguration();

    expect(pipelineConfiguration).toBeDefined();
    expect(pipelineConfiguration.vertex.entryPoint).toEqual("main_vertex");
    expect(pipelineConfiguration.fragment?.entryPoint).toEqual("main_fragment");
    expect(pipelineConfiguration.primitive?.topology).toEqual("triangle-list");
  });
  test("should draw a render pass", async () => {
    basicPipeline.meshaCanvas.device = {
      queue: {
        submit: vi.fn(() => ({})),
        writeBuffer: vi.fn(() => ({})),
      },
      createBindGroupLayout: vi.fn(() => ({})),
      createBindGroup: vi.fn(() => ({})),
      createPipelineLayout: vi.fn(() => ({})),
      createShaderModule: vi.fn(() => ({})),
      createRenderPipeline: vi.fn(() => ({})),
      createCommandEncoder: vi.fn(() => ({
        beginRenderPass: vi.fn(() => ({
          setPipeline: vi.fn(() => ({})),
          draw: vi.fn(() => ({})),
          end: vi.fn(() => ({})),
          setBindGroup: vi.fn(() => ({})),
          setVertexBuffer: vi.fn(() => ({})),
        })),
        finish: vi.fn(() => ({})),
      })),
      createTexture: vi.fn(() => ({
        createView: vi.fn(() => ({})),
      })),
      createBuffer: vi.fn(() => ({})),
    } as any;

    await basicPipeline.initialize();

    basicPipeline.meshaCanvas.context = {
      getCurrentTexture: vi.fn(() => ({
        createView: vi.fn(() => ({})),
      })),
    } as any;

    basicPipeline.uniformBuffer = {} as GPUBuffer;

    await basicPipeline.startRenderPass();

    // expect(basicPipeline.commandEncoder?.beginRenderPass).toHaveBeenCalled();
    // expect(basicPipeline.commandEncoder?.finish).toHaveBeenCalled();
    expect(basicPipeline.meshaCanvas.device?.queue.submit).toHaveBeenCalled();
  });
});
