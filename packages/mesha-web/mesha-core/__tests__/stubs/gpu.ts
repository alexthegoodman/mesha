import { vi } from "vitest";

export const navigator = {
  gpu: {
    requestAdapter: vi.fn(() => ({
      requestDevice: vi.fn(() => ({
        createShaderModule: vi.fn(() => ({})),
        createRenderPipeline: vi.fn(() => ({})),
        createCommandEncoder: vi.fn(() => ({})),
      })),
    })),
    getPreferredCanvasFormat: vi.fn(() => ({})),
  },
};
