import { describe, expect, test } from "vitest";
import BasicPipeline from "../../../renderer/pipelines/BasicPipeline";

describe("BasicPipeline", () => {
  test("should create BasicPipeline class with appropriate properties", () => {
    //instantiate class and check properties
    const basicPipeline = new BasicPipeline();

    expect(basicPipeline).toBeDefined();
    expect(basicPipeline).toBeInstanceOf(BasicPipeline);
    // expect(basicPipeline).toHaveProperty("name");
  });
});
