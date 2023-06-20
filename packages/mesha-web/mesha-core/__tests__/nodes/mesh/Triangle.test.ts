import { describe, expect, test, vi } from "vitest";
import MeshaCanvas from "../../../interface/MeshaCanvas";
import { navigator } from "../../stubs/gpu";
import Triangle from "../../../nodes/mesh/Triangle";

vi.stubGlobal("navigator", navigator);

describe("Triangle mesh node", () => {
  test("should create Triangle class with appropriate properties", async () => {
    const canvasElement = document.createElement("canvas");
    const meshaCanvas = new MeshaCanvas();

    await meshaCanvas.initialize(canvasElement);

    const triangle = new Triangle(meshaCanvas);

    triangle.createBuffer = vi.fn(() => ({})) as any;

    await triangle.initialize();

    expect(triangle).toBeDefined();
    expect(triangle).toBeInstanceOf(Triangle);
    expect(triangle).toHaveProperty("meshaCanvas");
    expect(triangle).toHaveProperty("buffer");
    expect(triangle).toHaveProperty("bufferLayout");
    expect(triangle).toHaveProperty("vertices");

    expect(triangle.vertices).toBeInstanceOf(Float32Array);
    expect(triangle.vertices).toHaveLength(15);
    expect(triangle.bufferLayout?.arrayStride).toEqual(20);
    expect(triangle.bufferLayout?.stepMode).toEqual("vertex");

    const attributes = triangle.bufferLayout?.attributes as any[];

    expect(attributes[0].format).toEqual("float32x2");
    expect(attributes[0].offset).toEqual(0);
    expect(attributes[1].format).toEqual("float32x3");
    expect(attributes[1].offset).toEqual(8);
  });
});
