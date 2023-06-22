import BasicMath from "../../helpers/BasicMath";
import { describe, expect, test } from "vitest";

describe("BasicMath helper", () => {
  test("degreesToRadians properly converts degrees to radians", () => {
    const basicMath = new BasicMath();

    expect(basicMath.degreesToRadians(0)).toBe(0);
    expect(basicMath.degreesToRadians(90)).toBe(Math.PI / 2);
    expect(basicMath.degreesToRadians(180)).toBe(Math.PI);
    expect(basicMath.degreesToRadians(270)).toBe((3 * Math.PI) / 2);
    expect(basicMath.degreesToRadians(360)).toBe(2 * Math.PI);
  });
});
