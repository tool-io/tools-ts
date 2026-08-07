import { describe, expect, it } from "vitest";
import { cloudComputingCostExample, runCloudComputingCost } from "./tool.js";
describe("cloud computing cost", () => {
  it("publishes an executable example", () =>
    expect(runCloudComputingCost(cloudComputingCostExample.input)).toEqual({
      ok: true,
      output: cloudComputingCostExample.output,
    }));
});
