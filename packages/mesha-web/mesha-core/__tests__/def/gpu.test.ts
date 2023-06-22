import { GPUBufferUsage, GPUTextureUsage } from "../../def/gpu";
import { describe, expect, test } from "vitest";

describe("gpu def", () => {
  test("GPUBufferUsage is valid", () => {
    expect(GPUBufferUsage).toBeDefined();
    expect(GPUBufferUsage).toBeInstanceOf(Object);
    expect(Object.keys(GPUBufferUsage).length).toBe(10);
  });
  test("GPUTextureUsage is valid", () => {
    expect(GPUTextureUsage).toBeDefined();
    expect(GPUTextureUsage).toBeInstanceOf(Object);
    expect(Object.keys(GPUTextureUsage).length).toBe(5);
  });
});
