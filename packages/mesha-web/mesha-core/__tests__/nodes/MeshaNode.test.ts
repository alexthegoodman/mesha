import { describe, expect, test, vi } from "vitest";
import { navigator } from "../stubs/gpu";
import MeshaCanvas from "../../interface/MeshaCanvas";
import { mockCanvas } from "../stubs/canvas";
import MeshaNode from "../../nodes/MeshaNode";

vi.stubGlobal("navigator", navigator);

describe("MeshaNode generic node", () => {
  test("should create MeshaNode class with appropriate properties", async () => {
    const meshaCanvas = new MeshaCanvas();

    await meshaCanvas.initialize(mockCanvas);

    const meshaNode = new MeshaNode(meshaCanvas);

    // meshaNode.meshaCanvas.device = {
    //   createBuffer: vi.fn(() => ({
    //     getMappedRange: vi.fn(() => new ArrayBuffer(108)),
    //   })) as any,
    // } as GPUDevice;

    await meshaNode.start();

    expect(meshaNode).toBeDefined();
    expect(meshaNode).toBeInstanceOf(MeshaNode);
    expect(meshaNode).toHaveProperty("meshaCanvas");
  });
});
