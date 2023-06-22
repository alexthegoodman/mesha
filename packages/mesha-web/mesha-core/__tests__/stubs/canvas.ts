import { vi } from "vitest";

export const mockCanvas = {
  getContext: vi.fn(() => ({
    configure: vi.fn(() => ({})),
  })),
  addEventListener: vi.fn(() => ({})),
} as unknown as HTMLCanvasElement;
