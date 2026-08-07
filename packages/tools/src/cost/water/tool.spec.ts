import { describe, expect, it } from "vitest";
import { runWaterCost, waterCostExample } from "./tool.js";
describe("water cost", () => {
  it("publishes an executable example", () =>
    expect(runWaterCost(waterCostExample.input)).toEqual({
      ok: true,
      output: waterCostExample.output,
    }));
});
