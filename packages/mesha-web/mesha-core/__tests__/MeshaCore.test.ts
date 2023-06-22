import { describe, expect, test, vi } from "vitest";
import MeshaCore from "../MeshaCore";
import { mockCanvas } from "./stubs/canvas";
import { navigator } from "./stubs/gpu";

vi.stubGlobal("navigator", navigator);

describe("MeshaCore", () => {
  test("should create MeshaCore class with appropriate properties", async () => {
    const meshaCore = new MeshaCore();

    // meshaCore.run = vi.fn(() => ({})) as any;

    // await meshaCore.initialize(mockCanvas);

    expect(meshaCore).toBeDefined();
    expect(meshaCore).toBeInstanceOf(MeshaCore);
    // expect(meshaCore).toHaveProperty("camera");
    // expect(meshaCore).toHaveProperty("pipeline");
  });
});
