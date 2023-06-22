import { describe, expect, test, vi } from "vitest";
import MeshaCanvas from "../../../interface/MeshaCanvas";
import { navigator } from "../../stubs/gpu";
import Cube from "../../../nodes/mesh/Cube";
import { mockCanvas } from "../../stubs/canvas";

vi.stubGlobal("navigator", navigator);

describe("Cube mesh node", () => {
  test("should create Cube class with appropriate properties", async () => {
    const meshaCanvas = new MeshaCanvas();

    await meshaCanvas.initialize(mockCanvas);

    const cube = new Cube(meshaCanvas);

    cube.createBuffer = vi.fn(() => ({})) as any;

    await cube.initialize();

    expect(cube).toBeDefined();
    expect(cube).toBeInstanceOf(Cube);
    expect(cube).toHaveProperty("meshaCanvas");
    expect(cube).toHaveProperty("vertexBuffer");
    expect(cube).toHaveProperty("colorBuffer");
    expect(cube).toHaveProperty("vertices");
    expect(cube).toHaveProperty("colors");
  });
});
