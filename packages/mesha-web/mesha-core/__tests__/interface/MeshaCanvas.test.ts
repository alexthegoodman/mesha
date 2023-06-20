import { beforeAll, describe, expect, test } from "vitest";
import MeshaCanvas from "../../interface/MeshaCanvas";

import { vi } from "vitest";
import { navigator } from "../stubs/gpu";

vi.stubGlobal("navigator", navigator);

describe("MeshaCanvas", () => {
  test("should create MeshaCanvas class with appropriate properties", async () => {
    const canvasElement = document.createElement("canvas");
    const meshaCanvas = new MeshaCanvas();

    await meshaCanvas.initialize(canvasElement);

    expect(meshaCanvas).toBeDefined();
    expect(meshaCanvas).toBeInstanceOf(MeshaCanvas);

    expect(meshaCanvas).toHaveProperty("canvas");
    expect(meshaCanvas).toHaveProperty("adapter");
    expect(meshaCanvas).toHaveProperty("device");
    expect(meshaCanvas).toHaveProperty("context");
    expect(meshaCanvas).toHaveProperty("format");

    expect(meshaCanvas.canvas).toBeInstanceOf(HTMLCanvasElement);
    expect(meshaCanvas.adapter).not.toBeNull();
    expect(meshaCanvas.device).not.toBeNull();
    // expect(meshaCanvas.context).not.toBeNull();
    expect(meshaCanvas.format).not.toBeNull();
  });
});
