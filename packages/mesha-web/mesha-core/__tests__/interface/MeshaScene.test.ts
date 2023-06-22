import { beforeAll, describe, expect, test } from "vitest";
import MeshaCanvas from "../../interface/MeshaCanvas";

import { vi } from "vitest";
import { navigator } from "../stubs/gpu";

vi.stubGlobal("navigator", navigator);

describe("MeshaScene", () => {
  test("should create MeshaScene class with appropriate properties", async () => {
    // expect(meshaCanvas).toBeDefined();
    // expect(meshaCanvas).toBeInstanceOf(MeshaCanvas);
    // expect(meshaCanvas).toHaveProperty("canvas");
    // expect(meshaCanvas.adapter).not.toBeNull();
  });
});
