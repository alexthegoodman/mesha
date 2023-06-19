import { describe, expect, test } from "vitest";
import MeshaCore from "../MeshaCore";

describe("MeshaCore", () => {
  test("should create MeshaCore class with appropriate properties", () => {
    //instantiate class and check properties
    const meshaCore = new MeshaCore();

    expect(meshaCore).toBeDefined();
    expect(meshaCore).toBeInstanceOf(MeshaCore);
    expect(meshaCore).toHaveProperty("Helpers");
    expect(meshaCore).toHaveProperty("MeshaCanvas");
    expect(meshaCore).toHaveProperty("MeshaScene");
  });

  test("initialize should attach to canvas element and create canvas and scene instances", () => {
    //instantiate class and check properties
    const meshaCore = new MeshaCore();
    const canvasElement = document.createElement("canvas");

    meshaCore.initialize(canvasElement);

    expect(meshaCore.canvas).toBeDefined();
    expect(meshaCore.canvas).toBeInstanceOf(MeshaCore.MeshaCanvas);
    expect(meshaCore.scene).toBeDefined();
    expect(meshaCore.scene).toBeInstanceOf(MeshaCore.MeshaScene);
  });
});
