import { colors, vertices } from "../../def/cube";
import { describe, expect, test } from "vitest";

describe("cube def", () => {
  test("vertices are valid", () => {
    expect(vertices).toBeDefined();
    expect(vertices).toBeInstanceOf(Float32Array);
    expect(vertices.length).toBe(108);
  });
  test("colors are valid", () => {
    expect(colors).toBeDefined();
    expect(colors).toBeInstanceOf(Float32Array);
    expect(colors.length).toBe(108);
  });
});
